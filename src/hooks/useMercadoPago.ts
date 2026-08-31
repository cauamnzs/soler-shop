import { useEffect, useRef, useState, useCallback } from "react";
import envConfig from "@/lib/envConfig";

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => MercadoPagoInstance;
  }
}

interface MercadoPagoInstance {
  fields: {
    create: (
      fieldName: "cardNumber" | "expirationDate" | "securityCode" | "cardholderName",
      options?: {
        placeholder?: string;
        style?: Record<string, unknown>;
      }
    ) => SecureField;
  };
  cardForm: {
    createCardToken: (args: {
      cardholderName?: { value?: string };
      identificationType?: string;
      identificationNumber?: string;
    }) => Promise<{
      id: string;
      status?: string;
      card_id?: string;
      first_six_digits?: string;
      last_four_digits?: string;
      payment_method?: { id?: string };
      error?: { message?: string };
    }>;
    getPaymentMethod: (bin: string) => Promise<unknown>;
    getIdentificationTypes: () => Promise<Array<{ id: string; name: string }>>;
  };
  getIdentificationTypes: MercadoPagoInstance["cardForm"]["getIdentificationTypes"];
}

interface SecureField {
  mount: (selector: string) => void;
  unmount: () => void;
  on: (event: string, handler: (payload: { error?: { message?: string } }) => void) => void;
  focus: () => void;
  blur: () => void;
}

export interface UseMercadoPagoArgs {
  mountOnMount?: boolean;
  locale?: "pt-BR";
  identificationNumber?: string;
  cardholderName?: string;
}

export interface UseMercadoPagoReturn {
  ready: boolean;
  loading: boolean;
  error: string | null;
  supported: boolean;
  fieldsMounted: boolean;
  createCardToken: () => Promise<{
    token: string;
    lastFourDigits: string;
    firstSixDigits: string;
    paymentMethodId: string;
  } | null>;
}

const SCRIPT_ID = "mp-sdk-js-v2";

const ensureScript = (): Promise<void> => {
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      if (window.MercadoPago) return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Erro ao carregar SDK do Mercado Pago.")), { once: true });
    });
  }
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.src = "https://sdk.mercadopago.com/js/v2";
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
  return new Promise<void>((resolve, reject) => {
    s.addEventListener("load", () => resolve(), { once: true });
    s.addEventListener("error", () => reject(new Error("Erro ao carregar SDK do Mercado Pago.")), { once: true });
  });
};

const sharedStyle = {
  base: {
    fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
    fontSize: "15px",
    fontWeight: "400",
    color: "hsl(var(--foreground))",
    "::placeholder": { color: "hsl(var(--muted-foreground) / 50%)" },
    ":focus": { outline: "none" },
  },
} as const;

export const useMercadoPago = ({
  mountOnMount = true,
  identificationNumber = "",
  cardholderName = "",
}: UseMercadoPagoArgs = {}): UseMercadoPagoReturn => {
  const mpRef = useRef<MercadoPagoInstance | null>(null);
  const fieldsRef = useRef<Partial<Record<"cardNumber" | "expirationDate" | "securityCode" | "cardholderName", SecureField | null>>>({});
  const mountedRef = useRef(false);
  const containerReadyRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [fieldsMounted, setFieldsMounted] = useState(false);

  const publicKey = envConfig.mercadoPago.publicKey;
  const supported = Boolean(publicKey && publicKey.length > 0 && typeof window !== "undefined");

  const unmountFields = useCallback(() => {
    const f = fieldsRef.current;
    (Object.keys(f) as Array<keyof typeof f>).forEach((k) => {
      try {
        f[k]?.unmount?.();
      } catch { /* noop */ }
      f[k] = null;
    });
    fieldsMounted && setFieldsMounted(false);
  }, [fieldsMounted]);

  const mountFields = useCallback(() => {
    if (!mpRef.current || mountedRef.current) return;
    const mp = mpRef.current;
    const missingIds = ["mp-card-number", "mp-expiration-date", "mp-security-code", "mp-cardholder-name"].filter(
      (id) => !document.getElementById(id)
    );
    if (missingIds.length > 0) {
      containerReadyRef.current = false;
      return;
    }
    try {
      const cardNumber = mp.fields.create("cardNumber", {
        placeholder: "0000 0000 0000 0000",
        style: sharedStyle as unknown as Record<string, unknown>,
      });
      const expirationDate = mp.fields.create("expirationDate", {
        placeholder: "MM/AA",
        style: sharedStyle as unknown as Record<string, unknown>,
      });
      const securityCode = mp.fields.create("securityCode", {
        placeholder: "123",
        style: sharedStyle as unknown as Record<string, unknown>,
      });
      const cardholderName = mp.fields.create("cardholderName", {
        placeholder: "COMO ESTÁ NO CARTÃO",
        style: sharedStyle as unknown as Record<string, unknown>,
      });
      cardNumber.mount("#mp-card-number");
      expirationDate.mount("#mp-expiration-date");
      securityCode.mount("#mp-security-code");
      cardholderName.mount("#mp-cardholder-name");

      const onErr = (where: string) => (p: { error?: { message?: string } }) => {
        if (p.error?.message) {
          console.warn(`[mp] ${where}:`, p.error.message);
        }
      };
      cardNumber.on("error", onErr("cardNumber"));
      expirationDate.on("error", onErr("expirationDate"));
      securityCode.on("error", onErr("securityCode"));
      cardholderName.on("error", onErr("cardholderName"));

      fieldsRef.current = { cardNumber, expirationDate, securityCode, cardholderName };
      mountedRef.current = true;
      containerReadyRef.current = true;
      setFieldsMounted(true);
    } catch (err) {
      setError("Falha ao inicializar os campos seguros do cartão.");
      console.error(err);
    }
  }, []);

  const waitForContainersThenMount = useCallback(() => {
    if (mountedRef.current) return;
    const maxRetries = 25;
    let retries = 0;
    const check = () => {
      const all = ["mp-card-number", "mp-expiration-date", "mp-security-code", "mp-cardholder-name"].every(
        (id) => Boolean(document.getElementById(id))
      );
      if (all) {
        mountFields();
      } else if (retries++ < maxRetries) {
        window.setTimeout(check, 80);
      } else {
        setError("Campos seguros do cartão não foram encontrados no DOM.");
      }
    };
    check();
  }, [mountFields]);

  useEffect(() => {
    let cancelled = false;
    if (!supported) return;
    if (typeof document === "undefined") return;

    setLoading(true);
    setError(null);
    ensureScript()
      .then(() => {
        if (cancelled) return;
        if (!window.MercadoPago) {
          throw new Error("SDK carregado, mas MercadoPago indisponível.");
        }
        if (!mpRef.current) {
          mpRef.current = new window.MercadoPago(publicKey, { locale: "pt-BR" });
        }
        setReady(true);
        if (mountOnMount) waitForContainersThenMount();
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Erro ao inicializar Mercado Pago.");
      })
      .finally(() => {
        !cancelled && setLoading(false);
      });
    return () => {
      cancelled = true;
      unmountFields();
      mountedRef.current = false;
    };
  }, [supported, publicKey, mountOnMount, unmountFields, waitForContainersThenMount]);

  const createCardToken = useCallback<UseMercadoPagoReturn["createCardToken"]>(async () => {
    if (!mpRef.current) {
      setError("Mercado Pago ainda não está pronto.");
      return null;
    }
    try {
      const idNumber = identificationNumber.replace(/\D/g, "");
      const res = await mpRef.current.cardForm.createCardToken({
        cardholderName: { value: cardholderName || undefined },
        identificationType: "CPF",
        identificationNumber: idNumber || undefined,
      });
      if (res.error?.message || !res.id) {
        setError(res.error?.message || "Não foi possível gerar o token do cartão.");
        return null;
      }
      setError(null);
      return {
        token: res.id,
        lastFourDigits: res.last_four_digits || "",
        firstSixDigits: res.first_six_digits || "",
        paymentMethodId: res.payment_method?.id || "unknown",
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao tokenizar o cartão.";
      setError(msg);
      console.error(err);
      return null;
    }
  }, [identificationNumber, cardholderName]);

  return {
    ready,
    loading,
    error,
    supported,
    fieldsMounted,
    createCardToken,
  };
};
