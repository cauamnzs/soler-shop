import type { CheckoutRequest } from "@/schemas/checkout";

export type AdminOrderPaymentMethod = "card" | "pix" | "ticket";

export type AdminOrderPaymentStatus =
  | "approved"
  | "authorized"
  | "in_process"
  | "pending"
  | "rejected"
  | "refunded"
  | "charged_back";

export interface AdminOrderItem {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface AdminOrder {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
  };
  address: CheckoutRequest["address"];
  createdAt: string;
  paymentMethod: AdminOrderPaymentMethod;
  paymentStatus: AdminOrderPaymentStatus;
  total: number;
  subtotal: number;
  shipping: number;
  ticketFee: number;
  installments?: number;
  installmentValue?: number;
  items: AdminOrderItem[];
  mpPaymentId?: string;
  trackingCode?: string;
}

const CUSTOMERS = [
  {
    name: "Mariana Almeida Santos",
    email: "mariana.almeida@exemplo.com",
    cpf: "33344455566",
    phone: "11987654321",
    address: {
      cep: "01419101",
      rua: "Rua Augusta",
      numero: "1500",
      complemento: "Ap 42",
      bairro: "Jardim Paulista",
      cidade: "São Paulo",
      uf: "SP",
    },
  },
  {
    name: "Lucas Pereira Cardoso",
    email: "lucas.cardoso@exemplo.com",
    cpf: "44455566677",
    phone: "21987654321",
    address: {
      cep: "22041011",
      rua: "Avenida Atlântica",
      numero: "200",
      complemento: "Bloco B",
      bairro: "Copacabana",
      cidade: "Rio de Janeiro",
      uf: "RJ",
    },
  },
  {
    name: "Bianca Costa Rocha",
    email: "bianca.rocha@exemplo.com",
    cpf: "55566677788",
    phone: "31987654321",
    address: {
      cep: "30140071",
      rua: "Rua da Bahia",
      numero: "1147",
      complemento: "Conjunto 801",
      bairro: "Lourdes",
      cidade: "Belo Horizonte",
      uf: "MG",
    },
  },
  {
    name: "João Vítor Mendes",
    email: "joao.mendes@exemplo.com",
    cpf: "66677788899",
    phone: "41987654321",
    address: {
      cep: "80030000",
      rua: "Rua XV de Novembro",
      numero: "800",
      complemento: "",
      bairro: "Centro",
      cidade: "Curitiba",
      uf: "PR",
    },
  },
  {
    name: "Sofia Ribeiro Gomes",
    email: "sofia.gomes@exemplo.com",
    cpf: "77788899900",
    phone: "51987654321",
    address: {
      cep: "90010001",
      rua: "Avenida Borges de Medeiros",
      numero: "2000",
      complemento: "Cobertura",
      bairro: "Menino Deus",
      cidade: "Porto Alegre",
      uf: "RS",
    },
  },
  {
    name: "Rafael Teixeira Nascimento",
    email: "rafael.nascimento@exemplo.com",
    cpf: "88899900011",
    phone: "61987654321",
    address: {
      cep: "70070550",
      rua: "Avenida SQS 304",
      numero: "Bloco C",
      complemento: "Ap 101",
      bairro: "Asa Sul",
      cidade: "Brasília",
      uf: "DF",
    },
  },
];

const STATUS_SEQUENCE: AdminOrderPaymentStatus[] = [
  "approved",
  "approved",
  "approved",
  "pending",
  "in_process",
  "rejected",
  "authorized",
  "pending",
  "approved",
];

const METHODS_SEQUENCE: AdminOrderPaymentMethod[] = [
  "card",
  "pix",
  "card",
  "ticket",
  "pix",
  "card",
  "card",
  "pix",
  "card",
];

const BASE_DATE = new Date();

const seedItem = (variant: number): AdminOrderItem => {
  const catalog = [
    {
      productId: "prod-perfume-01",
      name: "Eau de Parfum Santal Oud 100ml",
      image: "/placeholder.svg",
      unitPrice: 389.0,
      quantity: 1,
    },
    {
      productId: "prod-lipgloss-03",
      name: "Lip Gloss Luxe Diamond nº 3",
      image: "/placeholder.svg",
      unitPrice: 97.0,
      quantity: 2,
    },
    {
      productId: "prod-mist-honey",
      name: "Body Splash Rich Honey 250ml",
      image: "/placeholder.svg",
      unitPrice: 159.5,
      quantity: 1,
    },
    {
      productId: "prod-giftset-02",
      name: "Presente Soler Experience Kit Gold",
      image: "/placeholder.svg",
      unitPrice: 729.0,
      quantity: 1,
    },
    {
      productId: "prod-earrings-01",
      name: "Brincos Soler Gold Petal",
      image: "/placeholder.svg",
      unitPrice: 249.0,
      quantity: 1,
    },
  ];
  const base = catalog[variant % catalog.length];
  const lineTotal = Number((base.unitPrice * base.quantity).toFixed(2));
  return { ...base, lineTotal };
};

const buildItems = (seed: number): AdminOrderItem[] => {
  const size = 1 + (seed % 3);
  return Array.from({ length: size }, (_, i) => seedItem(seed + i));
};

const totalsFor = (items: AdminOrderItem[]) => {
  const subtotal = Number(
    items.reduce((s, i) => s + i.lineTotal, 0).toFixed(2)
  );
  const shipping = subtotal >= 299 ? 0 : 29.9;
  return { subtotal, shipping };
};

export const ADMIN_ORDERS: AdminOrder[] = Array.from({ length: 18 }, (_, i) => {
  const customer = CUSTOMERS[i % CUSTOMERS.length];
  const items = buildItems(i + 3);
  const { subtotal, shipping } = totalsFor(items);
  const method = METHODS_SEQUENCE[i % METHODS_SEQUENCE.length];
  const ticketFee = method === "ticket" ? 2.9 : 0;
  const total = Number((subtotal + shipping + ticketFee).toFixed(2));
  const installments = method === "card" ? 1 + ((i % 6) + 1) : undefined;
  const installmentValue =
    method === "card" && installments
      ? Number((total * Math.pow(1.0199, installments) / installments).toFixed(2))
      : undefined;
  const date = new Date(BASE_DATE.getTime() - i * 1000 * 60 * 60 * 26 - i * 42 * 60_000);
  return {
    orderNumber: `SOL-${2_100_000 + i * 137 + 41}-${date.getFullYear()}`,
    customer: { ...customer },
    address: { ...customer.address },
    createdAt: date.toISOString(),
    paymentMethod: method,
    paymentStatus: STATUS_SEQUENCE[i % STATUS_SEQUENCE.length],
    subtotal,
    shipping,
    ticketFee,
    total,
    installments,
    installmentValue,
    items,
    mpPaymentId: `MP-${100_000 + i * 491}-${i + 7}`,
    trackingCode: i % 4 === 0 ? `AA${1_000_000 + i * 13}BR` : undefined,
  };
});
