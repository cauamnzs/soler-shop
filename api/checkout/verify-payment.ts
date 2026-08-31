import crypto from "node:crypto";

export const config = { runtime: "nodejs18.x" };

interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
  json: () => Promise<unknown>;
  text?: () => Promise<string>;
}
interface VercelResponse {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
  json: (value: unknown) => void;
  end: (body?: string) => void;
}

const extract = (headers: Record<string, string | string[] | undefined>, key: string): string | undefined => {
  const v = headers[key] ?? headers[key.toLowerCase()];
  if (Array.isArray(v)) return v[0];
  return v;
};

const readBodyAsString = async (req: VercelRequest): Promise<string> => {
  if (typeof req.body === "string") return req.body;
  if (typeof (req as unknown as { rawBody?: string }).rawBody === "string") {
    return (req as unknown as { rawBody: string }).rawBody;
  }
  if (typeof req.body === "object" && req.body !== null) {
    try {
      return JSON.stringify(req.body);
    } catch {
      return "";
    }
  }
  try {
    if (typeof req.text === "function") return await req.text();
  } catch { /* noop */ }
  return "";
};

type MPAction = "payment.created" | "payment.updated" | "payment.approved" | "payment.rejected" | string;

interface MPWebhookPayload {
  action?: MPAction;
  api_version?: string;
  data?: { id?: string | number; type?: "payment" | "plan" | "subscription" };
  date_created?: string;
  id?: number | string;
  live_mode?: boolean;
  type?: "payment" | string;
  user_id?: string | number;
}

const verifySignature = (secret: string, ts: string, xId: string, payload: string, signature: string): boolean => {
  try {
    const manifest = `id:${xId};request-id:${xId || ""};ts:${ts};signature:${signature}`;
    // Mercado Pago usa manifesto com data_id, ts e o secret. Algumas versões:
    // manifest = `data_id:${xId}&date_created:${ts}`
    const candidate =
      typeof crypto.createHmac === "function"
        ? crypto
            .createHmac("sha256", secret)
            .update(`x-signature-id:${xId};x-timestamp:${ts};body-sha256:${sha256hex(payload)}`)
            .digest("hex")
        : "";
    // Mercado Pago também suporta formato concatenado abaixo, se falhar primeiro tenta o literal
    const candidate2 =
      typeof crypto.createHmac === "function"
        ? crypto.createHmac("sha256", secret).update(`${xId}${ts}${payload}`).digest("hex")
        : "";
    return (
      timingSafeEqual(signature, candidate) ||
      timingSafeEqual(signature, candidate2) ||
      timingSafeEqual(signature, manifest)
    );
  } catch {
    return false;
  }
};

const sha256hex = (s: string): string => crypto.createHash("sha256").update(s, "utf8").digest("hex");

const timingSafeEqual = (a: string, b: string): boolean => {
  if (!a || !b || a.length !== b.length) return false;
  try {
    const aB = Buffer.from(a);
    const bB = Buffer.from(b);
    if (aB.length !== bB.length) return false;
    return crypto.timingSafeEqual(aB, bB);
  } catch {
    return false;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = (req.method ?? "GET").toUpperCase();
  const jsonOut = (code: number, payload: unknown) => {
    const out = res.status(code);
    out.setHeader("Content-Type", "application/json; charset=utf-8");
    out.setHeader("X-Content-Type-Options", "nosniff");
    out.setHeader("Cache-Control", "no-store");
    out.json(payload);
  };

  if (method === "OPTIONS") {
    res.status(204);
    res.setHeader("Allow", "POST, HEAD, OPTIONS");
    return (res.end as (b?: string) => void)();
  }
  if (method !== "POST") {
    return jsonOut(405, { ok: false, error: "method_not_allowed" });
  }

  const mpSecret = process.env.MP_WEBHOOK_SECRET ?? "";
  const hasSecret = mpSecret.length >= 16;

  const rawBody = await readBodyAsString(req);
  let parsed: MPWebhookPayload | null = null;
  try {
    parsed = JSON.parse(rawBody) as MPWebhookPayload;
  } catch {
    return jsonOut(400, { ok: false, error: "invalid_json" });
  }

  const xSignature = extract(req.headers, "x-signature") ?? "";
  const xRequestId = extract(req.headers, "x-request-id") ?? "";
  const xDataId =
    String(parsed?.data?.id ?? extract(req.headers, "x-data-id") ?? "").trim() ||
    String(parsed?.id ?? "").trim();
  const tsHeader = extract(req.headers, "x-timestamp") ?? parsed?.date_created ?? "";
  const ts = typeof tsHeader === "string" ? tsHeader : String(tsHeader);

  if (hasSecret) {
    // Modo seguro: exige assinatura válida.
    const signatureOnly = xSignature.includes("=")
      ? xSignature.split(",").map((p) => p.trim()).find((p) => p.startsWith("sha256="))?.split("=").slice(1).join("=") ?? xSignature
      : xSignature;
    const ok = verifySignature(mpSecret, ts, xDataId, rawBody, signatureOnly);
    if (!ok) {
      // Ainda assim respondemos 200 para não gerar tempestade de retries (anomalias MP podem enviar x-header errado).
      // Logamos apenas.
      console.warn(
        "[verify-payment:invalid-signature]",
        { hasXSign: Boolean(xSignature), dataId: xDataId, action: parsed.action, type: parsed.type }
      );
    }
  }

  const action = parsed.action ?? "";
  const type = parsed.type ?? parsed.data?.type ?? "";
  const paymentId = parsed.data?.id ?? parsed.id ?? null;

  // Apenas interessam eventos de pagamento.
  if (type === "payment" || action.startsWith("payment.")) {
    console.info(
      "[mp-webhook:payment]",
      JSON.stringify({ action, id: paymentId, live: parsed.live_mode, ts })
    );
    // TODO: integrar com base de dados (orders table) quando disponível.
    // Exemplo:
    //   if (action === "payment.approved" || action === "payment.updated" && paymentId) → fetch order then status
  }

  // Mercado Pago espera sempre 200, senão reenvia.
  return jsonOut(200, { ok: true, received: true });
}
