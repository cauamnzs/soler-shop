const getEnv = (key: string, fallback = ""): string => {
  const value = (import.meta as unknown as { env?: Record<string, string> }).env?.[key];
  return value ?? fallback;
};

const envConfig = {
  supabase: {
    url: getEnv("VITE_SUPABASE_URL"),
    anonKey: getEnv("VITE_SUPABASE_ANON_KEY"),
  },
  contact: {
    whatsappNumber: getEnv("VITE_WHATSAPP_NUMBER", "5513991234567"),
    instagramHandle: getEnv("VITE_INSTAGRAM_HANDLE", "solershop_"),
    email: getEnv("VITE_CONTACT_EMAIL", "contato@solershop.com.br"),
  },
  business: {
    location: getEnv("VITE_BUSINESS_LOCATION", "Santos / Ilhabela — Envio Nacional"),
    name: getEnv("VITE_BUSINESS_NAME", "Soler Shop Importados"),
    cnpj: getEnv("VITE_BUSINESS_CNPJ", ""),
  },
  shipping: {
    flatRate: getEnv("VITE_SHIPPING_FLAT_RATE", "2990"),
    freeThreshold: getEnv("VITE_FREE_SHIPPING_THRESHOLD", "49900"),
  },
  mercadoPago: {
    publicKey: getEnv("VITE_MERCADO_PAGO_PUBLIC_KEY", ""),
  },
  admin: {
    emails: getEnv("VITE_ADMIN_EMAILS", ""),
  },
};

export const getWhatsAppLink = (message?: string): string => {
  const base = `https://wa.me/${envConfig.contact.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
};

export const getInstagramLink = (): string => {
  return `https://instagram.com/${envConfig.contact.instagramHandle}`;
};

export const getMailtoLink = (subject?: string, body?: string): string => {
  let href = `mailto:${envConfig.contact.email}`;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  if (qs) href += `?${qs}`;
  return href;
};

export default envConfig;
