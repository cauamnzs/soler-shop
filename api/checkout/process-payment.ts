import { checkoutRequestSchema, computeServerTotals, type CheckoutRequest } from "../_lib/checkout-shared.js";
import crypto from "node:crypto";

export const config = { runtime: "nodejs" };

interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
  json: () => Promise<unknown>;
}
interface VercelResponse {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
  json: (value: unknown) => void;
  end: (body?: string) => void;
}

type PaymentStatus =
  | "approved"
  | "authorized"
  | "in_process"
  | "pending"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back";

interface ProcessPaymentSuccess {
  ok: true;
  status: PaymentStatus;
  paymentId: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  ticketFee: number;
  installments?: number;
  installmentValue?: number;
  qrCodeBase64?: string;
  qrCodeRaw?: string;
  pixExpiresAt?: string;
  boletoUrl?: string;
  sandbox: boolean;
}

interface ProcessPaymentError {
  ok: false;
  httpStatus: number;
  code:
    | "method_not_allowed"
    | "invalid_json"
    | "invalid_body"
    | "unknown_product"
    | "payment_api_error"
    | "server_config_missing"
    | "rate_limited";
  message: string;
  details?: unknown;
  sandbox: boolean;
}

const PRODUCTION_ORIGINS = [
  "https://solershop.com.br",
  "https://www.solershop.com.br",
];

const VERCEL_PREVIEW_PATTERN = /^https:\/\/solershop-[\w-]+\.vercel\.app$/;
const VERCEL_TEAM_PATTERN = /^https:\/\/[\w-]+-git-[a-f0-9]+-solershop\.vercel\.app$/;
const LOCALHOST_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

const isValidOrigin = (origin: string | undefined): boolean => {
  if (!origin) return true;
  if (PRODUCTION_ORIGINS.includes(origin)) return true;
  if (LOCALHOST_PATTERN.test(origin)) return true;
  if (VERCEL_PREVIEW_PATTERN.test(origin)) return true;
  if (VERCEL_TEAM_PATTERN.test(origin)) return true;
  return false;
};

const extract = (headers: Record<string, string | string[] | undefined>, key: string): string | undefined => {
  const v = headers[key] ?? headers[key.toLowerCase()];
  if (Array.isArray(v)) return v[0];
  return v;
};

const generateOrderNumber = (): string => {
  const rand = Math.floor(1000000 + crypto.randomInt(0, 9000000));
  return `SOL-${rand}-${new Date().getFullYear()}`;
};

const mpBase = "https://api.mercadopago.com";

const isTestToken = (t: string) => t.startsWith("TEST-");

const payerNames = (full: string): { first: string; last: string } => {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return { first: "Cliente", last: "Soler" };
  if (parts.length === 1) return { first: parts[0], last: "Soler" };
  return {
    first: parts[0],
    last: parts.slice(1).join(" "),
  };
};

const buildJsonResponse = (res: VercelResponse) => (code: number, payload: unknown, origin?: string | undefined) => {
  const out = res.status(code);
  out.setHeader("Content-Type", "application/json; charset=utf-8");
  out.setHeader("Cache-Control", "no-store, no-cache, private, max-age=0");
  out.setHeader("X-Content-Type-Options", "nosniff");
  if (origin && isValidOrigin(origin)) {
    out.setHeader("Access-Control-Allow-Origin", origin);
    out.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    out.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    out.setHeader("Access-Control-Max-Age", "86400");
  }
  out.json(payload);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = extract(req.headers, "origin");
  const jsonOut = buildJsonResponse(res);

  const method = (req.method ?? "GET").toUpperCase();
  if (method === "OPTIONS") {
    return jsonOut(204, null, origin);
  }
  if (method !== "POST") {
    return jsonOut(
      405,
      {
        ok: false,
        httpStatus: 405,
        code: "method_not_allowed",
        message: "Método não permitido.",
        sandbox: !process.env.MP_ACCESS_TOKEN,
      } satisfies ProcessPaymentError,
      origin
    );
  }

  const mpToken = process.env.MP_ACCESS_TOKEN ?? "";
  const hasRealMp = Boolean(mpToken);

  let bodyRaw: unknown = null;
  try {
    bodyRaw = typeof req.body === "string" ? JSON.parse(req.body) : typeof req.body === "object" ? req.body : await req.json();
  } catch {
    return jsonOut(
      400,
      {
        ok: false,
        httpStatus: 400,
        code: "invalid_json",
        message: "Corpo da requisição não é JSON válido.",
        sandbox: !hasRealMp,
      } satisfies ProcessPaymentError,
      origin
    );
  }

  const parsed = checkoutRequestSchema.safeParse(bodyRaw);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
      code: i.code,
    }));
    return jsonOut(
      400,
      {
        ok: false,
        httpStatus: 400,
        code: "invalid_body",
        message: "Corpo da requisição inválido.",
        details: issues,
        sandbox: !hasRealMp,
      } satisfies ProcessPaymentError,
      origin
    );
  }
  const payload: CheckoutRequest = parsed.data as CheckoutRequest;

  let totals: ReturnType<typeof computeServerTotals>;
  try {
    totals = computeServerTotals(payload);
  } catch (e) {
    return jsonOut(
      422,
      {
        ok: false,
        httpStatus: 422,
        code: "unknown_product",
        message: e instanceof Error ? e.message : "Produto inválido no carrinho.",
        sandbox: !hasRealMp,
      } satisfies ProcessPaymentError,
      origin
    );
  }

  const orderNumber = generateOrderNumber();
  const payer = payerNames(payload.personal.nomeCompleto);
  const transactionAmount = Number(totals.total.toFixed(2));

  if (!hasRealMp || isTestToken("ignore-for-now") ) {
    // ════════════════════════════════════════════════════════════════
    // MODO SANDBOX LOCAL (sem MP_ACCESS_TOKEN)
    // Simula comportamento MP: aprova 90% para cartão, pix sempre "pending"
    // ════════════════════════════════════════════════════════════════
    if (payload.payment.metodo === "card") {
      const aprovado = Math.random() < 0.9 && payload.payment.cardToken.length >= 10;
      const status: PaymentStatus = aprovado ? "approved" : "rejected";
      return jsonOut(
        200,
        {
          ok: true,
          status,
          paymentId: `SANDBOX-${crypto.randomInt(10_000_000, 99_999_999)}`,
          orderNumber,
          total: transactionAmount,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          ticketFee: totals.ticketFee,
          installments: payload.payment.parcelas,
          installmentValue: Number(totals.installmentValue.toFixed(2)),
          sandbox: true,
        } satisfies ProcessPaymentSuccess,
        origin
      );
    }
    if (payload.payment.metodo === "pix") {
      const qrRaw = `00020126580014br.gov.bcb.pix0136soler-shop-${crypto.randomBytes(10).toString("hex")}@pix520400005303986540${transactionAmount.toFixed(2).padStart(13, "0")}5802BR5925SOLER SHOP IMPORTADOS6009SAO PAULO62070503***6304`;
      return jsonOut(
        200,
        {
          ok: true,
          status: "pending",
          paymentId: `SANDBOX-PIX-${crypto.randomInt(10_000_000, 99_999_999)}`,
          orderNumber,
          total: transactionAmount,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          ticketFee: totals.ticketFee,
          qrCodeBase64: "", // client-side placeholder será renderizado
          qrCodeRaw: qrRaw,
          pixExpiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
          sandbox: true,
        } satisfies ProcessPaymentSuccess,
        origin
      );
    }
    // ticket
    return jsonOut(
      200,
      {
        ok: true,
        status: "pending",
        paymentId: `SANDBOX-BOL-${crypto.randomInt(10_000_000, 99_999_999)}`,
        orderNumber,
        total: transactionAmount,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        ticketFee: totals.ticketFee,
        boletoUrl: "https://sandbox.linx.com.br/placeholder-boleto",
        sandbox: true,
      } satisfies ProcessPaymentSuccess,
      origin
    );
  }

  // ════════════════════════════════════════════════════════════════
  // INTEGRAÇÃO REAL MERCADO PAGO
  // ════════════════════════════════════════════════════════════════
  try {
    if (payload.payment.metodo === "card") {
      const body = {
        transaction_amount: transactionAmount,
        token: payload.payment.cardToken,
        description: `Pedido Soler Shop — ${orderNumber}`,
        installments: payload.payment.parcelas,
        payment_method_id: "master", // placeholder real substituído no MP pela identificação do token
        statement_descriptor: "SOLER SHOP",
        payer: {
          email: payload.personal.email,
          first_name: payer.first,
          last_name: payer.last,
          identification: { type: "CPF", number: payload.personal.cpf },
          phone: {
            area_code: payload.personal.celular.slice(0, 2),
            number: Number(payload.personal.celular.slice(2)),
          },
          address: {
            zip_code: payload.address.cep,
            street_name: payload.address.rua,
            street_number: payload.address.numero,
            neighborhood: payload.address.bairro,
            city: payload.address.cidade,
            federal_unit: payload.address.uf,
          },
        },
        notification_url:
          process.env.MP_WEBHOOK_URL ??
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/checkout/verify-payment` : undefined),
        metadata: { order_number: orderNumber, channel: "checkout_web", store: "solershop" },
      };

      const resp = await fetch(`${mpBase}/v1/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mpToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": orderNumber,
        },
        body: JSON.stringify(body),
      });
      const data = (await resp.json()) as {
        id?: number | string;
        status?: PaymentStatus;
        transaction_amount?: number;
        installments?: number;
        payment_method?: { id?: string };
        status_detail?: string;
        message?: string;
      };
      if (!resp.ok || !data.id) {
        console.error("[mp-create-card-payment]", resp.status, data);
        return jsonOut(
          402,
          {
            ok: false,
            httpStatus: 402,
            code: "payment_api_error",
            message: data?.message || "Não foi possível concluir o pagamento com o cartão.",
            details: typeof data === "object" ? { status_detail: data.status_detail } : undefined,
            sandbox: false,
          } satisfies ProcessPaymentError,
          origin
        );
      }
      return jsonOut(
        resp.ok ? 200 : 402,
        {
          ok: true,
          status: (data.status ?? "in_process") as PaymentStatus,
          paymentId: String(data.id),
          orderNumber,
          total: transactionAmount,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          ticketFee: totals.ticketFee,
          installments: payload.payment.parcelas,
          installmentValue: Number(totals.installmentValue.toFixed(2)),
          sandbox: false,
        } satisfies ProcessPaymentSuccess,
        origin
      );
    }

    if (payload.payment.metodo === "pix") {
      const body = {
        transaction_amount: transactionAmount,
        payment_method_id: "pix",
        description: `Pedido Soler Shop — ${orderNumber}`,
        payer: {
          email: payload.personal.email,
          first_name: payer.first,
          last_name: payer.last,
          identification: { type: "CPF", number: payload.personal.cpf },
          address: {
            zip_code: payload.address.cep,
            street_name: payload.address.rua,
            street_number: payload.address.numero,
            neighborhood: payload.address.bairro,
            city: payload.address.cidade,
            federal_unit: payload.address.uf,
          },
        },
        point_of_interaction: {
          type: "CUSTOMER",
        },
        notification_url:
          process.env.MP_WEBHOOK_URL ??
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/checkout/verify-payment` : undefined),
        metadata: { order_number: orderNumber },
        date_of_expiration: new Date(Date.now() + 15 * 60_000).toISOString(),
      };
      const resp = await fetch(`${mpBase}/v1/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mpToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": orderNumber,
        },
        body: JSON.stringify(body),
      });
      const data = (await resp.json()) as {
        id?: number | string;
        status?: PaymentStatus;
        point_of_interaction?: {
          transaction_data?: {
            qr_code_base64?: string;
            qr_code?: string;
            ticket_url?: string;
          };
        };
        date_of_expiration?: string;
        message?: string;
      };
      if (!resp.ok || !data.id) {
        console.error("[mp-create-pix-payment]", resp.status, data);
        return jsonOut(
          402,
          {
            ok: false,
            httpStatus: 402,
            code: "payment_api_error",
            message: data.message || "Não foi possível gerar o Pix.",
            sandbox: false,
          } satisfies ProcessPaymentError,
          origin
        );
      }
      const tx = data.point_of_interaction?.transaction_data;
      return jsonOut(
        200,
        {
          ok: true,
          status: (data.status ?? "pending") as PaymentStatus,
          paymentId: String(data.id),
          orderNumber,
          total: transactionAmount,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          ticketFee: totals.ticketFee,
          qrCodeBase64: tx?.qr_code_base64,
          qrCodeRaw: tx?.qr_code,
          pixExpiresAt: data.date_of_expiration,
          sandbox: false,
        } satisfies ProcessPaymentSuccess,
        origin
      );
    }

    // boleto
    const body = {
      transaction_amount: transactionAmount,
      payment_method_id: "bolbradesco",
      description: `Pedido Soler Shop — ${orderNumber}`,
      payer: {
        email: payload.personal.email,
        first_name: payer.first,
        last_name: payer.last,
        identification: { type: "CPF", number: payload.personal.cpf },
        address: {
          zip_code: payload.address.cep,
          street_name: payload.address.rua,
          street_number: payload.address.numero,
          neighborhood: payload.address.bairro,
          city: payload.address.cidade,
          federal_unit: payload.address.uf,
        },
      },
      date_of_expiration: new Date(Date.now() + 24 * 3_600_000).toISOString().split("T")[0],
      notification_url:
        process.env.MP_WEBHOOK_URL ??
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/checkout/verify-payment` : undefined),
      metadata: { order_number: orderNumber },
    };
    const resp = await fetch(`${mpBase}/v1/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mpToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": orderNumber,
      },
      body: JSON.stringify(body),
    });
    const data = (await resp.json()) as {
      id?: number | string;
      status?: PaymentStatus;
      point_of_interaction?: {
        transaction_data?: {
          ticket_url?: string;
        };
      };
      message?: string;
    };
    if (!resp.ok || !data.id) {
      console.error("[mp-create-boleto-payment]", resp.status, data);
      return jsonOut(
        402,
        {
          ok: false,
          httpStatus: 402,
          code: "payment_api_error",
          message: data.message || "Não foi possível gerar o boleto.",
          sandbox: false,
        } satisfies ProcessPaymentError,
        origin
      );
    }
    return jsonOut(
      200,
      {
        ok: true,
        status: (data.status ?? "pending") as PaymentStatus,
        paymentId: String(data.id),
        orderNumber,
        total: transactionAmount,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        ticketFee: totals.ticketFee,
        boletoUrl: data.point_of_interaction?.transaction_data?.ticket_url,
        sandbox: false,
      } satisfies ProcessPaymentSuccess,
      origin
    );
  } catch (err) {
    console.error("[process-payment:unhandled]", err);
    return jsonOut(
      500,
      {
        ok: false,
        httpStatus: 500,
        code: "payment_api_error",
        message: "Erro interno de servidor ao processar pagamento.",
        sandbox: !hasRealMp,
      } satisfies ProcessPaymentError,
      origin
    );
  }
}
