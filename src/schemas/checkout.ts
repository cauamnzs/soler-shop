import { z } from "zod";
import { products as PRODUCT_SOURCE_OF_TRUTH } from "@/data/mockData";
import {
  FREE_SHIPPING_THRESHOLD_BRL,
  SHIPPING_FLAT_RATE_BRL,
  TICKET_FEE_BRL,
  INTEREST_RATE_PER_MONTH,
  parsePrice,
  brlToCents,
  computeCompoundInstallment,
} from "@/lib/price";

export {
  FREE_SHIPPING_THRESHOLD_BRL,
  SHIPPING_FLAT_RATE_BRL,
  TICKET_FEE_BRL,
  INTEREST_RATE_PER_MONTH,
  parsePrice,
  brlToCents,
  computeCompoundInstallment,
};

export const onlyDigits = (v: string): string => String(v ?? "").replace(/\D/g, "");
export const trimAndUpper = (v: string): string => String(v ?? "").trim().toUpperCase();
export const trimAndLower = (v: string): string => String(v ?? "").trim().toLowerCase();

interface SanitizeStringOptions {
  minLength?: { value: number; message?: string };
  maxLength?: { value: number; message?: string };
  length?: { value: number; message?: string };
  email?: string;
  regex?: { pattern: RegExp; message: string };
}

const sanitizeString = (
  maxLen: number,
  transformer?: (v: string) => string,
  opts: SanitizeStringOptions = {}
) => {
  let inner: z.ZodString = z.string().trim();
  if (opts.length) inner = inner.length(opts.length.value, opts.length.message);
  if (opts.minLength) inner = inner.min(opts.minLength.value, opts.minLength.message);
  if (opts.email) inner = inner.email(opts.email);
  if (opts.regex) inner = inner.regex(opts.regex.pattern, opts.regex.message);
  if (maxLen > 0 && !opts.maxLength) inner = inner.max(maxLen);
  if (opts.maxLength) inner = inner.max(opts.maxLength.value, opts.maxLength.message);

  return z.preprocess(
    (v) => {
      let s = String(v ?? "").replace(/[\u0000-\u001F\u007F<>]/g, "").normalize("NFKC");
      if (transformer) s = transformer(s);
      return s.slice(0, maxLen > 0 ? maxLen : 10_000);
    },
    z.string()
  ).pipe(inner);
};

export const personalDataSchema = z
  .object({
    nomeCompleto: sanitizeString(140).superRefine((v, ctx) => {
      if (v.split(/\s+/).length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe nome e sobrenome." });
      }
    }),
    cpf: sanitizeString(11, onlyDigits, { length: { value: 11, message: "CPF deve ter 11 dígitos." } }),
    email: sanitizeString(200, trimAndLower, { email: "Informe um e-mail válido." }),
    celular: sanitizeString(14, onlyDigits, {
      regex: { pattern: /^\d{10,11}$/, message: "Celular deve ter DDD + 8 ou 9 dígitos." },
    }),
  })
  .strict();

export const addressSchema = z
  .object({
    cep: sanitizeString(8, onlyDigits, { length: { value: 8, message: "CEP deve ter 8 dígitos." } }),
    rua: sanitizeString(200, undefined, { minLength: { value: 1, message: "Informe a rua/logradouro." } }),
    numero: sanitizeString(20, undefined, { minLength: { value: 1, message: "Informe o número." } }),
    complemento: sanitizeString(100),
    bairro: sanitizeString(100, undefined, { minLength: { value: 1, message: "Informe o bairro." } }),
    cidade: sanitizeString(100, undefined, { minLength: { value: 1, message: "Informe a cidade." } }),
    uf: sanitizeString(2, trimAndUpper, { length: { value: 2, message: "UF inválida." } }),
  })
  .strict();

export const paymentMethod = z.enum(["card", "pix", "ticket"]);

export const paymentCardSchema = z
  .object({
    metodo: z.literal("card"),
    cardToken: sanitizeString(255, undefined, {
      minLength: { value: 10, message: "O token do cartão não foi gerado. Tente novamente." },
    }),
    nomeImpresso: sanitizeString(80, trimAndUpper).superRefine((v, ctx) => {
      if (v.split(/\s+/).length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nome impresso inválido." });
      }
    }),
    parcelas: z.coerce.number().int().min(1).max(12),
  })
  .strict();

export const paymentPixSchema = z.object({ metodo: z.literal("pix") }).strict();
export const paymentTicketSchema = z.object({ metodo: z.literal("ticket") }).strict();

export const paymentSchema = z.discriminatedUnion("metodo", [
  paymentCardSchema,
  paymentPixSchema,
  paymentTicketSchema,
]);

export const checkoutItemSchema = z
  .object({
    productId: sanitizeString(60),
    quantity: z.coerce.number().int().min(1).max(99),
  })
  .strict();

export const checkoutRequestSchema = z
  .object({
    personal: personalDataSchema,
    address: addressSchema,
    payment: paymentSchema,
    items: z.array(checkoutItemSchema).min(1, "Carrinho vazio."),
  })
  .strict();

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type PersonalData = z.infer<typeof personalDataSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;

export interface ServerTotals {
  subtotal: number;
  shipping: number;
  ticketFee: number;
  total: number;
  installmentTotal: number;
  installmentValue: number;
  hasFreeShipping: boolean;
  normalizedItems: Array<{ productId: string; name: string; unitPrice: number; quantity: number; lineTotal: number; image: string }>;
}

export const computeServerTotals = (req: CheckoutRequest): ServerTotals => {
  const lookup: Record<string, (typeof PRODUCT_SOURCE_OF_TRUTH)[number]> = {};
  for (const p of PRODUCT_SOURCE_OF_TRUTH) lookup[p.id] = p;

  const normalizedItems = req.items.map((i) => {
    const product = lookup[i.productId];
    if (!product) {
      throw new Error(`Produto desconhecido: ${i.productId}`);
    }
    const quantity = Math.max(1, Math.floor(i.quantity) || 1);
    const unitPrice = Math.max(0, parsePrice(product.price));
    const lineTotal = unitPrice * quantity;
    return {
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice,
      quantity,
      lineTotal,
    };
  });

  const subtotal = normalizedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_BRL;
  const shipping = hasFreeShipping ? 0 : SHIPPING_FLAT_RATE_BRL;
  const ticketFee = req.payment.metodo === "ticket" ? TICKET_FEE_BRL : 0;
  const total = subtotal + shipping + ticketFee;
  const months = req.payment.metodo === "card" ? Math.max(1, Math.min(12, req.payment.parcelas || 1)) : 1;
  const installmentTotal = computeCompoundInstallment(total, months);
  const installmentValue = months >= 1 ? installmentTotal / months : installmentTotal;

  return {
    subtotal,
    shipping,
    ticketFee,
    total,
    installmentTotal,
    installmentValue,
    hasFreeShipping,
    normalizedItems,
  };
};
