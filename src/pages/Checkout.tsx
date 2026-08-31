import { useState, useEffect, useMemo, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  User,
  MapPin,
  CreditCard,
  FileText,
  ArrowLeft,
  ArrowRight,
  Check,
  Truck,
  Shield,
  Sparkles,
  Loader2,
  ChevronRight,
  ShoppingBag,
  AlertCircle,
  QrCode,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart, formatPrice, parsePrice, FREE_SHIPPING as _deprecatedFS } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/envConfig";
import {
  checkoutRequestSchema,
  TICKET_FEE_BRL,
  computeCompoundInstallment,
  FREE_SHIPPING_THRESHOLD_BRL,
  SHIPPING_FLAT_RATE_BRL,
} from "@/schemas/checkout";
import { useMercadoPago } from "@/hooks/useMercadoPago";
import { useToast } from "@/components/ui/use-toast";

/* ══════════════════════════════════════════════════════════════════
   ÍCONE PIX INLINE (SVG) — lucide-react não exporta "Pix" nesta versão
   ══════════════════════════════════════════════════════════════════ */

const PixIcon = ({
  size = 20,
  className = "",
  strokeWidth = 1.8,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3L3 12l9 9 9-9-9-9z" />
    <path d="M16 8L8 16" />
    <path d="M8 8l8 8" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════
   TIPOS INTERNOS
   ══════════════════════════════════════════════════════════════════ */

type Step = 1 | 2 | 3;
type PaymentMethod = "card" | "pix" | "ticket";

interface ProcessPaymentResponse {
  ok: boolean;
  status?: string;
  orderNumber?: string;
  paymentId?: string | number;
  qrCodeBase64?: string;
  qrCodeRaw?: string;
  pixExpiresAt?: string;
  boletoUrl?: string;
  total?: number;
  installments?: number;
  installmentValue?: number;
  message?: string;
  code?: string;
  sandbox?: boolean;
}

interface DadosPessoais {
  nomeCompleto: string;
  cpf: string;
  email: string;
  celular: string;
}

interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

interface Pagamento {
  metodo: PaymentMethod;
  numeroCartao: string;
  nomeImpresso: string;
  validade: string;
  cvv: string;
  parcelas: number;
}

const emptyDadosPessoais: DadosPessoais = {
  nomeCompleto: "",
  cpf: "",
  email: "",
  celular: "",
};

const emptyEndereco: Endereco = {
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

const emptyPagamento: Pagamento = {
  metodo: "card",
  numeroCartao: "",
  nomeImpresso: "",
  validade: "",
  cvv: "",
  parcelas: 1,
};

/* ══════════════════════════════════════════════════════════════════
   MÁSCARAS CLIENT-SIDE
   ══════════════════════════════════════════════════════════════════ */

const maskCPF = (v: string): string => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const maskCelular = (v: string): string => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.replace(/^(\d{0,2})/, "($1");
  if (d.length <= 7) return d.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
};

const maskCEP = (v: string): string => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/^(\d{5})(\d{0,3})/, "$1-$2");
};

const maskCartao = (v: string): string => {
  const d = v.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const maskValidade = (v: string): string => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.replace(/^(\d{2})(\d{0,2})$/, "$1/$2");
};

const maskCVV = (v: string): string => v.replace(/\D/g, "").slice(0, 4);

/* ══════════════════════════════════════════════════════════════════
   A. ProgressStepper
   ══════════════════════════════════════════════════════════════════ */

const stepIcons = [User, MapPin, CreditCard];
const stepTitles = ["Dados Pessoais", "Endereço", "Pagamento"];

const ProgressStepper = ({ step }: { step: Step }) => {
  return (
    <div className="w-full mb-8 md:mb-10">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-6 left-0 right-0 h-[2px] bg-border/70 rounded-full" />
        <motion.div
          className="absolute top-6 left-0 h-[2px] rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light shadow-[0_0_10px_hsl(var(--gold)_/_0.35)]"
          initial={{ width: "0%" }}
          animate={{ width: `${((step - 1) / 2) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        />
        {([1, 2, 3] as Step[]).map((s, i) => {
          const Icon = stepIcons[i];
          const active = step >= s;
          return (
            <div key={s} className="relative flex flex-col items-center z-10 flex-1">
              <motion.div
                className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                  active
                    ? "bg-gradient-to-br from-gold-dark via-gold to-gold-light border-transparent text-primary-foreground shadow-[0_8px_24px_hsl(var(--gold)_/_0.35)]"
                    : "bg-card/60 backdrop-blur-md border-border/70 text-muted-foreground"
                )}
                animate={{ scale: step === s ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.4 }}
              >
                {active && step !== s ? (
                  <Check size={20} strokeWidth={2.5} />
                ) : (
                  <Icon size={20} strokeWidth={1.8} />
                )}
              </motion.div>
              <div className="mt-3 text-center px-1">
                <p
                  className={cn(
                    "font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.25em]",
                    active ? "text-gold font-semibold" : "text-muted-foreground"
                  )}
                >
                  Etapa {s}
                </p>
                <p
                  className={cn(
                    "font-body text-xs md:text-sm mt-0.5 md:mt-1",
                    active ? "text-foreground" : "text-muted-foreground/60"
                  )}
                >
                  {stepTitles[i]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   B. Step1PersonalData
   ══════════════════════════════════════════════════════════════════ */

const Step1PersonalData = ({
  data,
  onChange,
}: {
  data: DadosPessoais;
  onChange: (d: DadosPessoais) => void;
}) => {
  const handle = (k: keyof DadosPessoais, fn?: (v: string) => string) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const v = fn ? fn(e.target.value) : e.target.value;
    onChange({ ...data, [k]: v });
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-center gap-3 mb-2 md:mb-1">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gold/12 border border-gold/25 flex items-center justify-center">
          <User size={18} className="text-gold" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide text-foreground">
            Seus <span className="italic text-gold font-light">dados</span>
          </h2>
          <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 mt-0.5">
            Informações para contato
          </p>
        </div>
      </div>

      <Separator className="h-px border-0 bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

      <div className="space-y-4 md:space-y-5">
        <div className="space-y-2">
          <Label htmlFor="nome" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
            Nome completo*
          </Label>
          <Input
            id="nome"
            type="text"
            value={data.nomeCompleto}
            onChange={handle("nomeCompleto")}
            placeholder="Nome e sobrenome"
            className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <div className="space-y-2">
            <Label htmlFor="cpf" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
              CPF*
            </Label>
            <Input
              id="cpf"
              type="text"
              inputMode="numeric"
              value={data.cpf}
              onChange={handle("cpf", maskCPF)}
              placeholder="000.000.000-00"
              className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body tabular-nums"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
              E-mail*
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={handle("email")}
              placeholder="voce@email.com"
              className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cel" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
            Celular*
          </Label>
          <Input
            id="cel"
            type="tel"
            inputMode="tel"
            value={data.celular}
            onChange={handle("celular", maskCelular)}
            placeholder="(00) 00000-0000"
            className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body tabular-nums"
          />
        </div>
      </div>

      <div className="pt-2 flex items-start gap-3 p-4 md:p-5 rounded-2xl bg-gold/6 border border-gold/20">
        <Shield size={18} className="text-gold shrink-0 mt-0.5" strokeWidth={1.8} />
        <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">
          Seus dados estão protegidos. Utilizamos criptografia de ponta a ponta e nunca compartilhamos suas informações com terceiros.
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   C. Step2Address
   ══════════════════════════════════════════════════════════════════ */

const Step2Address = ({
  data,
  onChange,
}: {
  data: Endereco;
  onChange: (d: Endereco) => void;
}) => {
  const [buscando, setBuscando] = useState(false);
  const [erroCEP, setErroCEP] = useState("");

  const handle = (k: keyof Endereco, fn?: (v: string) => string) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const v = fn ? fn(e.target.value) : e.target.value;
    if (k === "cep") setErroCEP("");
    onChange({ ...data, [k]: v });
  };

  const buscarCEP = async () => {
    const cep = data.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      setErroCEP("Informe um CEP válido com 8 dígitos.");
      return;
    }
    setBuscando(true);
    setErroCEP("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const json = await res.json();
      if (json.erro) {
        setErroCEP("CEP não encontrado. Verifique e tente novamente.");
      } else {
        onChange({
          ...data,
          rua: json.logradouro ?? "",
          bairro: json.bairro ?? "",
          cidade: json.localidade ?? "",
          uf: json.uf ?? "",
        });
      }
    } catch {
      setErroCEP("Falha ao buscar CEP. Tente novamente.");
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-center gap-3 mb-2 md:mb-1">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gold/12 border border-gold/25 flex items-center justify-center">
          <MapPin size={18} className="text-gold" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide text-foreground">
            Seu <span className="italic text-gold font-light">endereço</span>
          </h2>
          <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 mt-0.5">
            Onde entregaremos o seu pedido
          </p>
        </div>
      </div>

      <Separator className="h-px border-0 bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

      <div className="space-y-4 md:space-y-5">
        <div className="space-y-2">
          <Label htmlFor="cep" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
            CEP*
          </Label>
          <div className="flex gap-2 md:gap-3">
            <div className="flex-1">
              <Input
                id="cep"
                type="text"
                inputMode="numeric"
                value={data.cep}
                onChange={handle("cep", maskCEP)}
                placeholder="00000-000"
                className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body tabular-nums"
              />
            </div>
            <Button
              type="button"
              onClick={buscarCEP}
              disabled={buscando}
              className="min-h-[44px] md:min-h-[48px] px-4 md:px-6 rounded-2xl bg-gold text-primary-foreground hover:bg-gold-dark font-body uppercase tracking-[0.18em] text-[10px] md:text-xs shadow-[0_6px_20px_hsl(var(--gold)_/_0.28)] active:scale-[0.98] transition-all duration-300"
            >
              {buscando ? <Loader2 size={16} className="animate-spin" /> : "Buscar"}
            </Button>
          </div>
          {erroCEP && (
            <p className="font-body text-xs text-destructive mt-1 pl-1">{erroCEP}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_140px] gap-4 md:gap-5">
          <div className="space-y-2">
            <Label htmlFor="rua" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
              Rua / Logradouro*
            </Label>
            <Input
              id="rua"
              type="text"
              value={data.rua}
              onChange={handle("rua")}
              placeholder="Nome da rua"
              className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="num" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
              Número*
            </Label>
            <Input
              id="num"
              type="text"
              value={data.numero}
              onChange={handle("numero")}
              placeholder="Nº"
              className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comp" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
            Complemento
          </Label>
          <Input
            id="comp"
            type="text"
            value={data.complemento}
            onChange={handle("complemento")}
            placeholder="Apartamento, bloco, referência (opcional)"
            className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bairro" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
            Bairro*
          </Label>
          <Input
            id="bairro"
            type="text"
            value={data.bairro}
            onChange={handle("bairro")}
            placeholder="Seu bairro"
            className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_80px] gap-4 md:gap-5">
          <div className="space-y-2">
            <Label htmlFor="cidade" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
              Cidade*
            </Label>
            <Input
              id="cidade"
              type="text"
              value={data.cidade}
              onChange={handle("cidade")}
              placeholder="Cidade"
              className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uf" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
              UF*
            </Label>
            <Input
              id="uf"
              type="text"
              maxLength={2}
              value={data.uf}
              onChange={(e) => onChange({ ...data, uf: e.target.value.toUpperCase() })}
              placeholder="SP"
              className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border-border/70 focus-visible:ring-gold/40 text-foreground placeholder:text-muted-foreground/50 font-body uppercase"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-start gap-3 p-4 md:p-5 rounded-2xl bg-secondary/50 border border-border/60">
        <Truck size={18} className="text-gold shrink-0 mt-0.5" strokeWidth={1.8} />
        <div className="space-y-1">
          <p className="font-body text-xs md:text-sm text-foreground font-semibold">
            Prazo de envio
          </p>
          <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">
            Confirme o CEP para visualizar o prazo e valor exato do frete para a sua região. Envio nacional para todo o Brasil.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   D. Step3Payment
   ══════════════════════════════════════════════════════════════════ */

const Step3Payment = ({
  data,
  onChange,
  totalBase,
  mpStatus,
}: {
  data: Pagamento;
  onChange: (d: Pagamento) => void;
  totalBase: number;
  mpStatus?: {
    supported: boolean;
    loading: boolean;
    ready: boolean;
    fieldsMounted: boolean;
    error: string | null;
  };
}) => {
  const handle = (k: keyof Pagamento, fn?: (v: string) => string) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const v = fn ? fn(e.target.value) : e.target.value;
    onChange({ ...data, [k]: v });
  };

  const parcelas = useMemo(() => {
    const arr: Array<{ n: number; valor: number; juros: boolean }> = [];
    for (let n = 1; n <= 12; n++) {
      const juros = n > 1;
      const tx = juros ? Math.pow(1 + 0.0199, n) : 1;
      const valor = (totalBase * tx) / n;
      arr.push({ n, valor, juros });
    }
    return arr;
  }, [totalBase]);

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-center gap-3 mb-2 md:mb-1">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gold/12 border border-gold/25 flex items-center justify-center">
          <CreditCard size={18} className="text-gold" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="font-heading text-xl md:text-2xl tracking-wide text-foreground">
            Seu <span className="italic text-gold font-light">pagamento</span>
          </h2>
          <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 mt-0.5">
            Escolha a forma de pagamento
          </p>
        </div>
      </div>

      <Separator className="h-px border-0 bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

      <Tabs
        value={data.metodo}
        onValueChange={(v) => onChange({ ...data, metodo: v as PaymentMethod })}
        className="w-full"
      >
        <TabsList className="w-full h-auto p-1.5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/60 shadow-sm">
          <div className="grid grid-cols-3 gap-1 md:gap-1.5 w-full">
            <TabsTrigger
              value="card"
              className="min-h-[44px] md:min-h-[50px] rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-gold-dark data-[state=active]:via-gold data-[state=active]:to-gold-light data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_6px_20px_hsl(var(--gold)_/_0.28)] font-body text-[10px] md:text-[11px] uppercase tracking-[0.18em] md:tracking-[0.22em] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2"
            >
              <CreditCard size={14} strokeWidth={1.8} />
              Cartão
            </TabsTrigger>
            <TabsTrigger
              value="pix"
              className="min-h-[44px] md:min-h-[50px] rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-gold-dark data-[state=active]:via-gold data-[state=active]:to-gold-light data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_6px_20px_hsl(var(--gold)_/_0.28)] font-body text-[10px] md:text-[11px] uppercase tracking-[0.18em] md:tracking-[0.22em] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2"
            >
              <PixIcon size={14} strokeWidth={1.8} />
              Pix
            </TabsTrigger>
            <TabsTrigger
              value="ticket"
              className="min-h-[44px] md:min-h-[50px] rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-gold-dark data-[state=active]:via-gold data-[state=active]:to-gold-light data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_6px_20px_hsl(var(--gold)_/_0.28)] font-body text-[10px] md:text-[11px] uppercase tracking-[0.18em] md:tracking-[0.22em] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2"
            >
              <FileText size={14} strokeWidth={1.8} />
              Boleto
            </TabsTrigger>
          </div>
        </TabsList>

        {/* Tab Cartão */}
        <TabsContent value="card" className="mt-5 md:mt-6 space-y-4 md:space-y-5">
          {mpStatus && !mpStatus.supported && (
            <div className="flex items-start gap-3 p-4 rounded-2xl border border-gold/30 bg-gold/6">
              <AlertCircle size={18} className="text-gold shrink-0 mt-0.5" strokeWidth={1.8} />
              <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">
                Integração Mercado Pago em modo <span className="font-semibold text-foreground">sandbox local</span>. Preenchimento manual temporário dos campos — em produção, os dados do cartão são capturados via Secure Fields e o código front-end nunca tem acesso ao PAN/CVV.
              </p>
            </div>
          )}
          {mpStatus && mpStatus.loading && (
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/60 bg-card/50">
              <Loader2 size={18} className="animate-spin text-gold" />
              <p className="font-body text-xs md:text-sm text-muted-foreground">
                Carregando o provedor de pagamentos seguro…
              </p>
            </div>
          )}
          {mpStatus && mpStatus.supported && !mpStatus.ready && !mpStatus.loading && (
            <div className="flex items-start gap-3 p-4 rounded-2xl border border-destructive/30 bg-destructive/5">
              <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" strokeWidth={1.8} />
              <div className="space-y-1">
                <p className="font-body text-xs md:text-sm text-destructive-foreground/90 font-semibold">
                  SDK do Mercado Pago não inicializado
                </p>
                <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Verifique a chave pública (VITE_MP_PUBLIC_KEY) e a conexão com a internet para habilitar os campos seguros do cartão.
                </p>
              </div>
            </div>
          )}
          {mpStatus?.error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl border border-destructive/30 bg-destructive/5">
              <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" strokeWidth={1.8} />
              <p className="font-body text-xs md:text-sm text-destructive-foreground/90 leading-relaxed">
                {mpStatus.error}
              </p>
            </div>
          )}

          {/* Número do cartão (Secure Field) — sempre renderiza a div para o SDK mountar */}
          <div className="space-y-2">
            <Label htmlFor="mp-card-number" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
              Número do cartão*
            </Label>
            <div
              id="mp-card-number"
              className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border border-border/70 focus-within:ring-2 focus-within:ring-gold/40 flex items-center px-3.5 text-foreground font-body tabular-nums tracking-wider"
            />
          </div>

          {/* Nome impresso (Secure Field) */}
          <div className="space-y-2">
            <Label htmlFor="mp-cardholder-name" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
              Nome impresso*
            </Label>
            <div
              id="mp-cardholder-name"
              className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border border-border/70 focus-within:ring-2 focus-within:ring-gold/40 flex items-center px-3.5 text-foreground font-body uppercase tracking-wider"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-2">
              <Label htmlFor="mp-expiration-date" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
                Validade*
              </Label>
              <div
                id="mp-expiration-date"
                className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border border-border/70 focus-within:ring-2 focus-within:ring-gold/40 flex items-center px-3.5 text-foreground font-body tabular-nums"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mp-security-code" className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1">
                CVV*
              </Label>
              <div
                id="mp-security-code"
                className="min-h-[44px] md:min-h-[48px] rounded-2xl bg-card/50 backdrop-blur-sm border border-border/70 focus-within:ring-2 focus-within:ring-gold/40 flex items-center px-3.5 text-foreground font-body tabular-nums"
              />
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <Label className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground pl-1 block">
              Parcelamento
            </Label>
            <div className="p-3 md:p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/60 space-y-2">
              {parcelas.map((p) => {
                const selected = data.parcelas === p.n;
                return (
                  <button
                    key={p.n}
                    type="button"
                    onClick={() => onChange({ ...data, parcelas: p.n })}
                    className={cn(
                      "w-full min-h-[48px] md:min-h-[52px] flex items-center justify-between px-4 md:px-5 rounded-xl border transition-all duration-300 active:scale-[0.99]",
                      selected
                        ? "border-gold/50 bg-gold/10 shadow-[0_4px_14px_hsl(var(--gold)_/_0.18)]"
                        : "border-border/60 bg-background/40 hover:border-gold/30 hover:bg-gold/5"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center",
                          selected ? "border-gold bg-gold" : "border-border/70 bg-transparent"
                        )}
                      >
                        {selected && <Check size={12} strokeWidth={3} className="text-primary-foreground" />}
                      </span>
                      <span className="font-body text-sm md:text-base text-foreground font-medium">
                        {p.n}x
                      </span>
                    </span>
                    <div className="text-right">
                      <span
                        className={cn(
                          "font-body text-sm md:text-base font-semibold tabular-nums",
                          selected ? "text-gold" : "text-foreground"
                        )}
                      >
                        {formatPrice(p.valor)}
                      </span>
                      {p.juros && (
                        <span className="font-body text-[10px] md:text-xs text-muted-foreground block mt-0.5 uppercase tracking-[0.15em]">
                          com juros de 1,99% a.m.
                        </span>
                      )}
                      {!p.juros && (
                        <span className="font-body text-[10px] md:text-xs text-gold block mt-0.5 uppercase tracking-[0.15em] font-semibold">
                          sem juros
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Tab Pix */}
        <TabsContent value="pix" className="mt-5 md:mt-6">
          <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-card/40 to-gold/5 backdrop-blur-xl saturate-[180%] border border-border/60 rounded-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--gold)_/_0.12),transparent_60%)]" />
            <div className="relative flex flex-col items-center text-center gap-5 md:gap-6 z-10">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-gold-dark via-gold to-gold-light flex items-center justify-center shadow-[0_12px_40px_hsl(var(--gold)_/_0.4)]">
                <div className="absolute inset-0 rounded-full bg-white/15 animate-pulse" />
                <PixIcon size={40} className="text-primary-foreground relative z-10" strokeWidth={1.8} />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="font-heading text-2xl md:text-3xl text-foreground tracking-wide">
                  Pagamento <span className="italic text-gold font-light">Pix</span>
                </h3>
                <Badge
                  variant="outline"
                  className="rounded-full border-gold/30 bg-gold/8 text-gold px-4 py-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold"
                >
                  <Sparkles size={11} className="mr-1.5" strokeWidth={2} />
                  Aprovado instantaneamente
                </Badge>
                <Separator className="h-px w-24 mx-auto border-0 bg-gradient-to-r from-transparent via-gold/40 to-transparent my-4 md:my-5" />
                <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                  Após confirmar, exibiremos o QR Code para pagamento instantâneo. Basta escanear com o app do seu banco e a compra será aprovada em segundos.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab Boleto */}
        <TabsContent value="ticket" className="mt-5 md:mt-6">
          <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-card/40 backdrop-blur-xl saturate-[180%] border border-border/60 rounded-3xl" />
            <div className="relative flex flex-col items-center text-center gap-5 md:gap-6 z-10">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-secondary/80 border-2 border-border/80 flex items-center justify-center shadow-[0_10px_32px_hsl(var(--charcoal)_/_0.14)]">
                <FileText size={40} className="text-gold relative z-10" strokeWidth={1.6} />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="font-heading text-2xl md:text-3xl text-foreground tracking-wide">
                  Boleto <span className="italic text-gold font-light">bancário</span>
                </h3>
                <Badge
                  variant="outline"
                  className="rounded-full border-border/70 bg-background/60 text-muted-foreground px-4 py-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold"
                >
                  Vencimento em 1 dia útil
                </Badge>
                <Separator className="h-px w-24 mx-auto border-0 bg-gradient-to-r from-transparent via-gold/40 to-transparent my-4 md:my-5" />
                <div className="space-y-3 max-w-md">
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                    Boleto bancário com vencimento para 1 dia útil após a confirmação do pedido. Após o pagamento, a liberação ocorre em até 3 dias úteis.
                  </p>
                  <div className="flex items-center justify-center gap-2 p-3 md:p-3.5 rounded-2xl bg-gold/10 border border-gold/25">
                    <FileText size={15} className="text-gold shrink-0" strokeWidth={1.8} />
                    <span className="font-body text-xs md:text-sm text-foreground">
                      Taxa de processamento:{" "}
                      <span className="font-semibold text-gold">{formatPrice(2.9)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   E. CartSummary
   ══════════════════════════════════════════════════════════════════ */

const TICKET_FEE = TICKET_FEE_BRL;

const CartSummary = ({
  paymentMethod,
  onConfirm,
  loading,
  step,
}: {
  paymentMethod: PaymentMethod;
  onConfirm: () => void;
  loading: boolean;
  step: Step;
}) => {
  const { items, count, subtotal, shipping, hasFreeShipping } = useCart();

  const taxaBoleto = paymentMethod === "ticket" ? TICKET_FEE : 0;
  const total = subtotal + shipping + taxaBoleto;

  return (
    <div className="rounded-3xl bg-card/35 backdrop-blur-xl saturate-[180%] border border-border/70 shadow-[0_12px_36px_hsl(var(--charcoal)_/_0.12)] overflow-hidden">
      <div className="px-5 sm:px-6 md:px-7 py-5 md:py-6 border-b border-border/60 bg-gradient-to-br from-gold/8 via-transparent to-transparent">
        <h2 className="font-heading text-xl md:text-2xl tracking-wide text-foreground">
          Resumo do <span className="italic text-gold font-light">Pedido</span>
        </h2>
        <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-muted-foreground/60 mt-1.5">
          {count} {count === 1 ? "item" : "itens"}
        </p>
      </div>

      {items.length > 0 && (
        <div className="px-5 sm:px-6 md:px-7 py-4 md:py-5 max-h-64 overflow-y-auto scrollbar-hide border-b border-border/50 space-y-3">
          {items.slice(0, 4).map((item) => {
            const lineTotal = parsePrice(item.product.price) * item.quantity;
            return (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="w-12 h-14 md:w-14 md:h-16 shrink-0 rounded-xl overflow-hidden border border-border/60 bg-card/50">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs md:text-sm text-foreground leading-tight line-clamp-2">
                    {item.product.name}
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground mt-1 tabular-nums">
                    qtd. {item.quantity}
                  </p>
                </div>
                <span className="font-body text-xs md:text-sm font-semibold text-gold tabular-nums shrink-0">
                  {formatPrice(lineTotal)}
                </span>
              </div>
            );
          })}
          {items.length > 4 && (
            <p className="font-body text-[10px] uppercase tracking-[0.18em] text-muted-foreground text-center pt-1">
              + {items.length - 4} {items.length - 4 === 1 ? "item" : "itens"}
            </p>
          )}
        </div>
      )}

      <div className="px-5 sm:px-6 md:px-7 py-5 md:py-6 space-y-4">
        <div className="flex items-center justify-between font-body text-sm md:text-base text-foreground/85">
          <span className="uppercase tracking-[0.18em] text-muted-foreground text-[11px] md:text-xs">
            Subtotal
          </span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between font-body text-sm md:text-base text-foreground/85">
          <span className="uppercase tracking-[0.18em] text-muted-foreground text-[11px] md:text-xs">
            Frete
          </span>
          {hasFreeShipping ? (
            <span className="tabular-nums text-gold font-medium uppercase tracking-widest text-[11px] flex items-center gap-1.5">
              <Truck size={13} strokeWidth={2} /> Grátis
            </span>
          ) : (
            <span className="tabular-nums">{formatPrice(shipping)}</span>
          )}
        </div>

        {taxaBoleto > 0 && (
          <div className="flex items-center justify-between font-body text-sm md:text-base text-foreground/85">
            <span className="uppercase tracking-[0.18em] text-muted-foreground text-[11px] md:text-xs">
              Taxa boleto
            </span>
            <span className="tabular-nums">{formatPrice(taxaBoleto)}</span>
          </div>
        )}

        <Separator className="border-border/60" />

        <div className="flex items-end justify-between pt-1">
          <span className="font-heading text-lg md:text-xl tracking-wide text-foreground">
            Total
          </span>
          <div className="text-right">
            <p className="font-body text-2xl md:text-3xl font-semibold text-gold tabular-nums">
              {formatPrice(total)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 md:px-7 pb-2">
        <Button
          onClick={onConfirm}
          disabled={step !== 3 || loading}
          className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-primary-foreground uppercase tracking-[0.22em] md:tracking-[0.28em] text-[11px] md:text-xs font-bold py-5 md:py-6 rounded-2xl hover:shadow-[0_12px_40px_hsl(var(--gold)_/_0.35)] transition-all duration-500 ease-lux active:scale-[0.98] group relative overflow-hidden shadow-[0_8px_32px_hsl(var(--gold)_/_0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 ease-lux pointer-events-none" />
          <span className="relative z-10 flex items-center justify-center gap-2.5 md:gap-3">
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Processando
              </>
            ) : (
              <>
                {step === 3 ? "Confirmar Pagamento" : "Avançar Etapa"}
                {step !== 3 && <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />}
                {step === 3 && (
                  <Sparkles size={14} className="transition-transform duration-500 group-hover:scale-110" />
                )}
              </>
            )}
          </span>
        </Button>
      </div>

      <div className="px-5 sm:px-6 md:px-7 py-5 md:py-6 grid grid-cols-3 gap-2 md:gap-3 border-t border-border/60 mt-4">
        <div className="flex flex-col items-center text-center gap-2 p-3 md:p-3.5 rounded-2xl bg-background/40 border border-border/50 backdrop-blur-sm">
          <Shield size={16} strokeWidth={1.7} className="text-gold" />
          <span className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground/75 leading-tight">
            Checkout Seguro
          </span>
        </div>
        <div className="flex flex-col items-center text-center gap-2 p-3 md:p-3.5 rounded-2xl bg-background/40 border border-border/50 backdrop-blur-sm">
          <Truck size={16} strokeWidth={1.7} className="text-gold" />
          <span className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground/75 leading-tight">
            {hasFreeShipping ? "Frete Grátis" : "Em até 7 dias"}
          </span>
        </div>
        <div className="flex flex-col items-center text-center gap-2 p-3 md:p-3.5 rounded-2xl bg-background/40 border border-border/50 backdrop-blur-sm">
          <CreditCard size={16} strokeWidth={1.7} className="text-gold" />
          <span className="font-body text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground/75 leading-tight">
            Pix, Crédito
          </span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   F. MobileStickyBottomBar
   ══════════════════════════════════════════════════════════════════ */

const MobileStickyBottomBar = ({
  step,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  loading,
}: {
  step: Step;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  loading: boolean;
}) => {
  return (
    <div
      className="md:hidden fixed bottom-3 left-3 right-3 z-[9960] rounded-2xl border border-border/15 bg-card/90 backdrop-blur-xl saturate-[180%] shadow-[0_12px_40px_hsl(var(--charcoal)_/_0.25)] p-2"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack || loading}
          className="min-h-[48px] rounded-xl border-border/60 bg-background/40 backdrop-blur-sm text-foreground hover:bg-secondary/40 font-body uppercase tracking-[0.18em] text-[10px] active:scale-[0.97] disabled:opacity-40"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Voltar
        </Button>
        <Button
          onClick={onForward}
          disabled={!canGoForward || loading}
          className="min-h-[48px] rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-primary-foreground font-body uppercase tracking-[0.18em] text-[10px] shadow-[0_6px_20px_hsl(var(--gold)_/_0.35)] active:scale-[0.97] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Processando
            </>
          ) : (
            <>
              {step === 3 ? (
                <>
                  <Sparkles size={13} />
                  Confirmar
                </>
              ) : (
                <>
                  Avançar
                  <ChevronRight size={14} strokeWidth={2.2} />
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   ANIMAÇÕES DE SLIDE DOS STEPS
   ══════════════════════════════════════════════════════════════════ */

const stepVariants: Variants = {
  enterLeft: { opacity: 0, x: 40, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
  enterRight: { opacity: 0, x: -40, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
  center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
  exitLeft: { opacity: 0, x: -40, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } },
  exitRight: { opacity: 0, x: 40, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } },
};

/* ══════════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL — Checkout
   ══════════════════════════════════════════════════════════════════ */

const Checkout = () => {
  const navigate = useNavigate();
  const { items, hydrated, subtotal, shipping, clear } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>(1);
  const [prevStep, setPrevStep] = useState<Step>(1);
  const [personal, setPersonal] = useState<DadosPessoais>(emptyDadosPessoais);
  const [address, setAddress] = useState<Endereco>(emptyEndereco);
  const [payment, setPayment] = useState<Pagamento>(emptyPagamento);
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  const mp = useMercadoPago({
    identificationNumber: personal.cpf,
    cardholderName: payment.nomeImpresso || personal.nomeCompleto,
  });

  useEffect(() => {
    setPrevStep(step);
  }, [step]);

  const step1Valid = useMemo(() => {
    const nome = personal.nomeCompleto.trim().split(/\s+/).length >= 2;
    const cpf = personal.cpf.replace(/\D/g, "").length === 11;
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email.trim());
    const cel = personal.celular.replace(/\D/g, "").length >= 11;
    return nome && cpf && email && cel;
  }, [personal]);

  const step2Valid = useMemo(() => {
    const cep = address.cep.replace(/\D/g, "").length === 8;
    const rua = address.rua.trim().length > 0;
    const num = address.numero.trim().length > 0;
    const bairro = address.bairro.trim().length > 0;
    const cidade = address.cidade.trim().length > 0;
    const uf = address.uf.trim().length === 2;
    return cep && rua && num && bairro && cidade && uf;
  }, [address]);

  const step3Valid = useMemo(() => {
    if (payment.metodo === "card") {
      // PCI-DSS: NÃO validamos dados de cartão em texto puro — o Secure Fields do MP (iframe) valida internamente
      // Aqui só garantimos que o SDK carregou, campos estão montados e parcelas é válido.
      const parc = payment.parcelas >= 1 && payment.parcelas <= 12;
      const sdkReady =
        mp.supported === false /* modo sandbox */ || (mp.ready && mp.fieldsMounted) || !mp.supported;
      return parc && sdkReady;
    }
    return true;
  }, [payment, mp.supported, mp.ready, mp.fieldsMounted]);

  const taxaBoleto = payment.metodo === "ticket" ? TICKET_FEE : 0;
  const totalComTaxas = subtotal + shipping + taxaBoleto;

  const canGoBack = step > 1 && !loadingPagamento;
  const canGoForward =
    !loadingPagamento &&
    ((step === 1 && step1Valid) || (step === 2 && step2Valid) || (step === 3 && step3Valid));

  const goBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const goForward = () => {
    if (step === 1 && step1Valid) setStep(2);
    else if (step === 2 && step2Valid) setStep(3);
    else if (step === 3 && step3Valid) handleConfirm();
  };

  const handleConfirm = async () => {
    if (!canGoForward) return;
    setLoadingPagamento(true);
    try {
      navigator.vibrate?.(12);
    } catch { /* noop */ }

    try {
      // (A) Montar payload no formato esperado pelo schema compartilhado
      const itemsPayload = items.map((i) => ({
        productId: String(i.product.id),
        quantity: Math.max(1, Math.floor(i.quantity) || 1),
      }));

      let paymentPayload: Record<string, unknown>;
      if (payment.metodo === "card") {
        if (mp.supported && mp.ready) {
          const tokenRes = await mp.createCardToken();
          if (!tokenRes) {
            const hint =
              mp.error ||
              "Não foi possível gerar o token do cartão. Verifique os dados e tente novamente.";
            toast({
              title: "Cartão não validado",
              description: hint,
              variant: "destructive",
              duration: 4000,
            });
            setLoadingPagamento(false);
            return;
          }
          paymentPayload = {
            metodo: "card",
            cardToken: tokenRes.token,
            nomeImpresso: (payment.nomeImpresso || personal.nomeCompleto).toUpperCase().slice(0, 80),
            parcelas: payment.parcelas,
          };
        } else {
          // Sem chave MP configurada: sandbox de cardToken gerado pelo backend se receber valor vazio.
          paymentPayload = {
            metodo: "card",
            cardToken: "SANDBOX-CARD-TOKEN",
            nomeImpresso: (payment.nomeImpresso || personal.nomeCompleto).toUpperCase().slice(0, 80),
            parcelas: payment.parcelas,
          };
        }
      } else if (payment.metodo === "pix") {
        paymentPayload = { metodo: "pix" };
      } else {
        paymentPayload = { metodo: "ticket" };
      }

      const rawRequestBody = {
        personal: {
          nomeCompleto: personal.nomeCompleto,
          cpf: personal.cpf.replace(/\D/g, ""),
          email: personal.email,
          celular: personal.celular.replace(/\D/g, ""),
        },
        address: {
          cep: address.cep.replace(/\D/g, ""),
          rua: address.rua,
          numero: address.numero,
          complemento: address.complemento,
          bairro: address.bairro,
          cidade: address.cidade,
          uf: address.uf.toUpperCase(),
        },
        payment: paymentPayload,
        items: itemsPayload,
      };

      // (B) Validação client-side dupla (apenas UX — backend valida independente)
      const clientCheck = checkoutRequestSchema.safeParse(rawRequestBody);
      if (!clientCheck.success) {
        const issue = clientCheck.error.issues[0];
        const hint = issue ? `${issue.path.join(".")}: ${issue.message}` : "Dados inválidos.";
        toast({
          title: "Verifique os dados",
          description: hint,
          variant: "destructive",
          duration: 4000,
        });
        setLoadingPagamento(false);
        return;
      }

      // (C) Chamada backend serverless.
      let httpStatus = 0;
      let json: ProcessPaymentResponse | null = null;
      try {
        const res = await fetch("/api/checkout/process-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(rawRequestBody),
        });
        httpStatus = res.status;
        json = await res.json().catch(() => null);
      } catch (err) {
        console.error(err);
        toast({
          title: "Sem conexão com o servidor",
          description: "Verifique sua internet e tente novamente.",
          variant: "destructive",
          duration: 4000,
        });
        setLoadingPagamento(false);
        return;
      }

      // (D) Decisão de navegação por status HTTP + body
      const approved = (s: string) =>
        s === "approved" || s === "authorized";
      const inProgress = (s: string) =>
        s === "pending" || s === "in_process";

      if (httpStatus >= 200 && httpStatus < 300 && json && json.ok === true) {
        const status: string = String(json.status || "pending");
        const orderNumber: string = String(json.orderNumber || "");
        if (payment.metodo === "pix") {
          navigate("/order/success", {
            replace: true,
            state: {
              paymentMethod: "pix",
              status,
              orderNumber,
              paymentId: String(json.paymentId || ""),
              qrCodeBase64: typeof json.qrCodeBase64 === "string" ? json.qrCodeBase64 : "",
              qrCodeRaw: typeof json.qrCodeRaw === "string" ? json.qrCodeRaw : "",
              pixExpiresAt: typeof json.pixExpiresAt === "string" ? json.pixExpiresAt : "",
              total: typeof json.total === "number" ? json.total : undefined,
            },
          });
          queueMicrotask(() => clear());
          return;
        }
        if (approved(status)) {
          navigate("/order/success", {
            replace: true,
            state: {
              paymentMethod: payment.metodo,
              status,
              orderNumber,
              paymentId: String(json.paymentId || ""),
              installments: json.installments,
              installmentValue: json.installmentValue,
              total: typeof json.total === "number" ? json.total : undefined,
            },
          });
          queueMicrotask(() => clear());
          return;
        }
        if (inProgress(status) && payment.metodo === "ticket") {
          navigate("/order/success", {
            replace: true,
            state: {
              paymentMethod: "ticket",
              status,
              orderNumber,
              paymentId: String(json.paymentId || ""),
              boletoUrl: typeof json.boletoUrl === "string" ? json.boletoUrl : "",
              total: typeof json.total === "number" ? json.total : undefined,
            },
          });
          queueMicrotask(() => clear());
          return;
        }
        if (inProgress(status)) {
          navigate("/order/success", {
            replace: true,
            state: {
              paymentMethod: payment.metodo,
              status,
              orderNumber,
              paymentId: String(json.paymentId || ""),
              total: typeof json.total === "number" ? json.total : undefined,
            },
          });
          queueMicrotask(() => clear());
          return;
        }
        // rejected
        navigate("/order/failure", {
          replace: true,
          state: { reason: status || "rejected", paymentId: String(json.paymentId || "") },
        });
        return;
      }

      // Falhas 4xx / 5xx
      const code = json?.code ?? "payment_api_error";
      const msg =
        json?.message ?? "Não foi possível processar o pagamento. Tente novamente.";
      toast({
        title: code === "invalid_body" ? "Dados inválidos" : "Erro no pagamento",
        description: msg,
        variant: "destructive",
        duration: 5000,
      });
      const navigateReason: Record<string, string> = {
        unknown_product: "unknown_product",
        invalid_body: "invalid_body",
        payment_api_error: "payment_api_error",
        server_config_missing: "server_config_missing",
      };
      navigate("/order/failure", {
        replace: false,
        state: {
          reason: navigateReason[String(code)] || (code === "payment_api_error" ? "card_declined" : String(code)),
          paymentId: json?.paymentId || "",
          from: "checkout",
        },
      });
    } finally {
      setLoadingPagamento(false);
    }
  };

  /* ════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════ */

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen relative bg-background selection:bg-gold/20 overflow-x-hidden">
        <Header />
        <main className="relative z-10 max-w-7xl mx-auto section-padding pt-10 md:pt-14 lg:pt-20 pb-32">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-10 h-[1px] bg-gold/50 block" />
            <span className="w-1.5 h-1.5 bg-gold/60 rotate-45 inline-block" />
            <span className="w-10 h-[1px] bg-gold/50 block" />
          </div>
          <div className="max-w-2xl mx-auto py-14 md:py-20 flex flex-col items-center text-center px-4">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-card/40 border border-border/70 backdrop-blur-md flex items-center justify-center mb-8 shadow-[0_12px_36px_hsl(var(--charcoal)_/_0.12)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/10 via-transparent to-gold/5 blur-xl pointer-events-none" />
              <ShoppingBag size={36} strokeWidth={1.2} className="text-muted-foreground/60 relative z-10" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground mb-3">
              Checkout <span className="italic text-gold font-light">vazio</span>
            </h1>
            <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground font-light mb-6">
              Seu carrinho está vazio
            </p>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Adicione produtos ao seu carrinho para prosseguir com a finalização da compra. Descubra fragrâncias importadas, body splashes exclusivos e kits premium.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-gold-dark via-gold to-gold-light text-primary-foreground uppercase tracking-[0.22em] text-[11px] md:text-xs font-bold px-8 py-5 rounded-2xl hover:shadow-[0_12px_40px_hsl(var(--gold)_/_0.35)] transition-all duration-500 ease-lux active:scale-[0.98] shadow-[0_8px_32px_hsl(var(--gold)_/_0.25)]"
            >
              <Link to="/">
                Explorar Catálogo
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const forward = step > prevStep;

  return (
    <div className="min-h-screen relative bg-background selection:bg-gold/20 overflow-x-hidden">
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto section-padding pt-10 md:pt-14 pb-32">
        <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
          <span className="w-10 h-[1px] bg-gold/50 block" />
          <span className="w-1.5 h-1.5 bg-gold/60 rotate-45 inline-block" />
          <span className="w-10 h-[1px] bg-gold/50 block" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 md:mb-10 px-2"
        >
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-3">
            Finalizar <span className="italic text-gold font-light">Compra</span>
          </h1>
          <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground font-light">
            Siga 3 passos rápidos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px] gap-6 lg:gap-10 items-start">
          {/* Coluna 1 — Steps */}
          <div className="min-w-0">
            <ProgressStepper step={step} />

            <motion.div
              key={step}
              initial={forward ? "enterRight" : "enterLeft"}
              animate="center"
              exit={forward ? "exitLeft" : "exitRight"}
              variants={stepVariants}
            >
              <div className="rounded-3xl bg-card/30 backdrop-blur-xl saturate-[180%] border border-border/60 shadow-[0_12px_36px_hsl(var(--charcoal)_/_0.12)] p-5 sm:p-7 md:p-8">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Step1PersonalData data={personal} onChange={setPersonal} />
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Step2Address data={address} onChange={setAddress} />
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Step3Payment
                        data={payment}
                        onChange={setPayment}
                        totalBase={totalComTaxas}
                        mpStatus={{
                          supported: mp.supported,
                          loading: mp.loading,
                          ready: mp.ready,
                          fieldsMounted: mp.fieldsMounted,
                          error: mp.error,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="hidden lg:flex items-center justify-between mt-6 px-2">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={!canGoBack}
                className="min-h-[50px] px-6 rounded-2xl border-border/70 bg-card/50 text-foreground hover:bg-secondary/50 font-body uppercase tracking-[0.2em] text-xs active:scale-[0.98] disabled:opacity-40"
              >
                <ArrowLeft size={15} />
                Voltar
              </Button>
              <div className="font-body text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Etapa {step} de 3
              </div>
              <Button
                onClick={step === 3 ? handleConfirm : goForward}
                disabled={!canGoForward}
                className="min-h-[50px] px-7 rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-primary-foreground font-body uppercase tracking-[0.22em] text-xs shadow-[0_8px_28px_hsl(var(--gold)_/_0.3)] active:scale-[0.98] hover:shadow-[0_12px_36px_hsl(var(--gold)_/_0.4)] transition-all duration-300 disabled:opacity-50"
              >
                {step === 3 ? (
                  loadingPagamento ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Processando
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Confirmar Pagamento
                    </>
                  )
                ) : (
                  <>
                    Avançar
                    <ArrowRight size={15} />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Coluna 2 — Summary Sticky */}
          <aside className="sticky top-28 md:top-32 z-20">
            <CartSummary
              paymentMethod={payment.metodo}
              onConfirm={handleConfirm}
              loading={loadingPagamento}
              step={step}
            />
            <div className="mt-5 md:mt-6 flex justify-center">
              <Link
                to="/"
                className="touch-cta group inline-flex items-center gap-2 font-body text-[11px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-gold transition-colors duration-400 active:scale-95"
              >
                <ShoppingBag size={13} strokeWidth={1.7} />
                Continuar comprando
                <ChevronRight size={12} className="transition-transform duration-500 group-hover:translate-x-1" strokeWidth={2.2} />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <MobileStickyBottomBar
        step={step}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onBack={goBack}
        onForward={goForward}
        loading={loadingPagamento}
      />
    </div>
  );
};

export default Checkout;
