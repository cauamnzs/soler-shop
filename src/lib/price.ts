export const FREE_SHIPPING_THRESHOLD_BRL = 299;
export const SHIPPING_FLAT_RATE_BRL = 29.9;
export const TICKET_FEE_BRL = 2.9;
export const INTEREST_RATE_PER_MONTH = 0.0199;

export const parsePrice = (formatted: string | number | null | undefined): number => {
  if (typeof formatted === "number") return isFinite(formatted) ? formatted : 0;
  if (typeof formatted !== "string" || !formatted.trim()) return 0;
  const digits = formatted.replace(/[^\d,]/g, "").replace(",", ".");
  const n = parseFloat(digits);
  return isFinite(n) ? n : 0;
};

export const formatPrice = (value: number): string => {
  const v = isFinite(value) && value >= 0 ? value : 0;
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

export const brlToCents = (brl: number): number =>
  Math.round(Math.max(0, brl) * 100);

export const computeCompoundInstallment = (base: number, months: number): number => {
  const n = Math.max(1, Math.floor(months) || 1);
  if (n <= 1) return base;
  const rate = INTEREST_RATE_PER_MONTH;
  const factor = Math.pow(1 + rate, n);
  return base * factor;
};
