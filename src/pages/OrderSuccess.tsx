import { lazy, Suspense, useState, useMemo, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { CheckCircle, Sparkles, Copy, MessageCircle, ArrowRight, Package, Truck, Shield, QrCode, CreditCard, FileText, ExternalLink } from "lucide-react";
import { useNavigate, Link, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart, formatPrice } from "@/contexts/CartContext";
import { getWhatsAppLink } from "@/lib/envConfig";
import { cn } from "@/lib/utils";

const Header = lazy(() => import("@/components/Header"));

type PaymentMethod = "pix" | "card" | "ticket";

interface SuccessLocationState {
  paymentMethod?: PaymentMethod;
  status?: string;
  orderNumber?: string;
  paymentId?: string;
  qrCodeBase64?: string;
  qrCodeRaw?: string;
  pixExpiresAt?: string;
  boletoUrl?: string;
  installments?: number;
  installmentValue?: number;
  total?: number;
}

const PIX_COPIA_E_COLA_PLACEHOLDER =
  "00020126580014br.gov.bcb.pix0136soler-shop@placeholder.com520400005303986540499.905802BR5925SOLER SHOP IMPORTADOS LTDA6009SAO PAULO62070503***6304ABCD";

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const QrPlaceholder = ({ size = 200, base64 }: { size?: number; base64?: string | null }) => {
  if (base64 && base64.trim().length > 0) {
    return (
      <div
        className="relative rounded-3xl border border-border/70 bg-background shadow-[0_4px_24px_hsl(var(--charcoal)_/_0.14)] overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img
          src={base64}
          alt="QR Code Pix"
          className="absolute inset-0 w-full h-full object-cover p-2"
          loading="eager"
        />
      </div>
    );
  }
  return (
    <div
      className="relative rounded-3xl border border-border/70 bg-background shadow-[0_4px_24px_hsl(var(--charcoal)_/_0.14)] overflow-hidden"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 grid grid-cols-[repeat(13,1fr)] grid-rows-[repeat(13,1fr)] p-4">
        {Array.from({ length: 13 * 13 }).map((_, i) => {
          const r = Math.floor(i / 13);
          const c = i % 13;
          const isCorner =
            (r < 3 && c < 3) ||
            (r < 3 && c > 9) ||
            (r > 9 && c < 3);
          const filled = isCorner || (r * c + r + c) % 3 === 0;
          return (
            <div key={i} className="flex items-center justify-center p-[1px]">
              <div
                className={cn(
                  "w-full h-full rounded-sm transition-colors duration-500",
                  filled ? "bg-gold/85" : "bg-transparent"
                )}
              />
            </div>
          );
        })}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="rounded-2xl bg-background border border-border/80 p-3 shadow-lg">
          <QrCode size={size > 240 ? 38 : 30} strokeWidth={1.6} className="text-gold" />
        </div>
      </div>
    </div>
  );
};

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { items, subtotal, shipping, total: cartTotal, hasFreeShipping, hydrated } = useCart();
  const state = (location.state ?? {}) as SuccessLocationState;
  const [orderNumber, setOrderNumber] = useState<string>(state.orderNumber || "");
  const [copied, setCopied] = useState(false);

  const qrCodeRaw = state.qrCodeRaw || PIX_COPIA_E_COLA_PLACEHOLDER;
  const paymentMethod: PaymentMethod = state.paymentMethod || "pix";
  const displayTotal = typeof state.total === "number" && state.total > 0 ? state.total : cartTotal;

  useEffect(() => {
    if (orderNumber) return;
    const n = `SOL-${Math.floor(Math.random() * 9000000 + 1000000)}-${new Date().getFullYear()}`;
    setOrderNumber(n);
  }, [orderNumber]);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeRaw);
      setCopied(true);
      try {
        navigator.vibrate?.(8);
      } catch {
        /* noop */
      }
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* noop */
    }
  };

  const displayItems = useMemo(() => {
    return items.map((item) => {
      const unit =
        typeof item.product.price === "number"
          ? isFinite(item.product.price) ? item.product.price : 0
          : (() => {
              if (typeof item.product.price !== "string" || !item.product.price.trim()) return 0;
              const digits = item.product.price.replace(/[^\d,]/g, "").replace(",", ".");
              const n = parseFloat(digits);
              return isFinite(n) ? n : 0;
            })();
      return {
        key: item.product.id,
        image: item.product.image,
        name: item.product.name,
        quantity: item.quantity,
        unit,
        lineTotal: unit * item.quantity,
      };
    });
  }, [items]);

  return (
    <div className="min-h-screen relative bg-background selection:bg-gold/20 overflow-x-hidden">
      <Suspense fallback={<div className="h-16 md:h-20 lg:h-24" />}>
        <Header />
      </Suspense>

      <main className="relative z-10 max-w-4xl mx-auto section-padding pt-10 md:pt-16 pb-32">
        {/* Hero do Sucesso */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="text-center mb-10 md:mb-14 lg:mb-16 px-2"
        >
          <div className="relative inline-flex items-center justify-center mb-8">
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gold/20 blur-3xl"
              style={{ width: 180, height: 180 }}
            />
            <div
              className="relative rounded-full bg-card/40 backdrop-blur-xl border border-gold/30 flex items-center justify-center shadow-[0_12px_48px_hsl(var(--gold)_/_0.25)]"
              style={{ width: 140, height: 140 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 18 }}
                className="rounded-full bg-gold/95 shadow-[inset_0_2px_8px_hsl(var(--gold-light)_/_0.6),0_6px_20px_hsl(var(--gold)_/_0.45)] flex items-center justify-center"
                style={{ width: 92, height: 92 }}
              >
                <CheckCircle size={52} strokeWidth={1.5} className="text-background" />
              </motion.div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-10 h-[1px] bg-gold/50 block" />
            <span className="w-1.5 h-1.5 bg-gold/60 rotate-45 inline-block" />
            <span className="w-10 h-[1px] bg-gold/50 block" />
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-3">
            Pedido <span className="italic text-gold font-light">confirmado</span>!
          </h1>
          <p className={`font-body text-xs md:text-sm uppercase tracking-[0.28em] text-muted-foreground font-light mb-5`}>
            Obrigado por escolher a Soler Shop
          </p>
          <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-card/45 backdrop-blur-md border border-border/60 shadow-[0_2px_16px_hsl(var(--charcoal)_/_0.14)]">
            <Sparkles size={14} strokeWidth={1.8} className="text-gold" />
            <span className="font-body text-xs md:text-sm uppercase tracking-[0.22em] text-muted-foreground">
              Nº
            </span>
            <span className="font-heading text-base md:text-lg text-foreground tabular-nums tracking-wide">
              {orderNumber || "Preparando…"}
            </span>
          </div>
        </motion.section>

        {/* Pagamento + QR Code Pix */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={cardVariants}
          className="rounded-3xl bg-card/35 backdrop-blur-xl border border-border/70 shadow-[0_16px_60px_hsl(var(--charcoal)_/_0.14)] overflow-hidden mb-8 md:mb-10"
        >
          <div className="px-5 sm:px-6 md:px-8 py-6 md:py-7 border-b border-border/60 bg-gradient-to-br from-gold/10 via-transparent to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                {paymentMethod === "pix" && <QrCode size={18} strokeWidth={1.7} className="text-gold" />}
                {paymentMethod === "card" && <CreditCard size={18} strokeWidth={1.7} className="text-gold" />}
                {paymentMethod === "ticket" && <FileText size={18} strokeWidth={1.7} className="text-gold" />}
              </div>
              <div>
                <h2 className="font-heading text-xl md:text-2xl tracking-wide text-foreground">
                  {paymentMethod === "pix" && (
                    <>Pagamento via <span className="italic text-gold font-light">Pix</span></>
                  )}
                  {paymentMethod === "card" && (
                    <>Pagamento com <span className="italic text-gold font-light">Cartão</span></>
                  )}
                  {paymentMethod === "ticket" && (
                    <>Pagamento com <span className="italic text-gold font-light">Boleto Bancário</span></>
                  )}
                </h2>
                <p className={`font-body text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-muted-foreground mt-0.5`}>
                  {paymentMethod === "pix" && (
                    state.pixExpiresAt
                      ? `Válido até ${new Date(state.pixExpiresAt).toLocaleString("pt-BR")}`
                      : "Válido por 15 minutos após confirmação"
                  )}
                  {paymentMethod === "card" &&
                    (state.status === "approved" || state.status === "authorized"
                      ? "Pagamento aprovado — já liberamos para separação"
                      : "Aguardando confirmação da operadora")}
                  {paymentMethod === "ticket" && "Vencimento em até 1 dia útil"}
                </p>
              </div>
            </div>
          </div>

          {paymentMethod === "pix" && (
            <div className="px-5 sm:px-6 md:px-8 py-7 md:py-9 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-10 items-center">
              {/* Col 1 — QR Code */}
              <div className="flex flex-col items-center gap-5 mx-auto md:mx-0">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
                >
                  <QrPlaceholder
                    base64={state.qrCodeBase64 || null}
                    size={typeof window !== "undefined" && window.innerWidth >= 768 ? 260 : 200}
                  />
                </motion.div>

                <Button
                  onClick={handleCopyPix}
                  variant="outline"
                  className={cn(
                    "min-h-[44px] w-full md:w-auto rounded-2xl border-gold/35 bg-gold/[0.06] hover:bg-gold/15 hover:border-gold/50 text-foreground group transition-all duration-400 px-5 py-3",
                    copied && "bg-gold/20 border-gold/60 text-gold"
                  )}
                >
                  <span className="flex items-center gap-2.5 font-body text-xs uppercase tracking-[0.2em]">
                    {copied ? (
                      <>
                        <CheckCircle size={14} strokeWidth={2} className="text-gold" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={14} strokeWidth={1.8} className="text-gold" />
                        Copiar QR Copia & Cola
                      </>
                    )}
                  </span>
                </Button>
              </div>

              {/* Col 2 — Info */}
              <div className="relative space-y-5 md:space-y-6">
                <Sparkles
                  size={18}
                  strokeWidth={1.5}
                  className="absolute -top-2 -right-1 text-gold/50 animate-pulse"
                />
                <Sparkles
                  size={14}
                  strokeWidth={1.5}
                  className="absolute top-20 -left-3 text-gold/40"
                />
                <Sparkles
                  size={12}
                  strokeWidth={1.5}
                  className="absolute bottom-6 right-4 text-gold/35"
                />

                <div>
                  <h3 className="font-heading text-lg md:text-xl text-foreground mb-2">
                    Finalize o pagamento no seu app do banco
                  </h3>
                  <p className={`font-body text-sm md:text-base text-muted-foreground leading-relaxed`}>
                    Abra o aplicativo do seu banco, escolha a opção Pix e escaneie o QR Code ao lado.
                    Se preferir, copie o código Copia & Cola e cole diretamente no campo indicado.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3 pt-2">
                  <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-background/45 border border-border/50 backdrop-blur-sm">
                    <Shield size={16} strokeWidth={1.7} className="text-gold" />
                    <span className={`font-body text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground/75 leading-tight`}>
                      Pagamento Seguro
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-background/45 border border-border/50 backdrop-blur-sm">
                    <Truck size={16} strokeWidth={1.7} className="text-gold" />
                    <span className={`font-body text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground/75 leading-tight`}>
                      Envio Nacional
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-background/45 border border-border/50 backdrop-blur-sm">
                    <Package size={16} strokeWidth={1.7} className="text-gold" />
                    <span className={`font-body text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground/75 leading-tight`}>
                      Embalagem Premium
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-4 md:p-5 flex items-start gap-3">
                  <Sparkles size={16} strokeWidth={1.8} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-body text-xs md:text-sm text-foreground font-medium`}>
                      Após a confirmação
                    </p>
                    <p className={`font-body text-[11px] md:text-xs text-muted-foreground mt-1 leading-relaxed`}>
                      Você receberá um e-mail com todos os detalhes do pedido e o código de
                      rastreio assim que for despachado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="px-5 sm:px-6 md:px-8 py-7 md:py-9 space-y-5 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="rounded-2xl border border-border/60 bg-background/50 p-4 md:p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                      <CreditCard size={16} strokeWidth={1.8} className="text-gold" />
                    </div>
                    <h3 className="font-heading text-lg md:text-xl tracking-wide text-foreground">
                      Forma de pagamento
                    </h3>
                  </div>
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mb-2">
                    {state.installments && state.installments > 0 ? (
                      <>
                        <span className="font-semibold text-foreground">{state.installments}x</span> de{" "}
                        <span className="font-semibold text-gold tabular-nums">
                          {formatPrice(state.installmentValue || displayTotal / (state.installments || 1))}
                        </span>{" "}
                        no cartão{state.installments! > 1 ? " com juros" : " sem juros"}.
                      </>
                    ) : (
                      <>Pagamento à vista no cartão.</>
                    )}
                  </p>
                  {state.paymentId && (
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                      ID: {state.paymentId}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-4 md:p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/35 flex items-center justify-center">
                      <Shield size={16} strokeWidth={1.8} className="text-gold" />
                    </div>
                    <h3 className="font-heading text-lg md:text-xl tracking-wide text-foreground">
                      Status do pagamento
                    </h3>
                  </div>
                  <Badge
                    variant={state.status === "approved" || state.status === "authorized" ? "default" : "outline"}
                    className={cn(
                      "rounded-full px-4 py-1.5 uppercase tracking-[0.2em] text-[10px] md:text-[11px]",
                      state.status === "approved" || state.status === "authorized"
                        ? "bg-gold text-primary-foreground border-transparent shadow-[0_4px_14px_hsl(var(--gold)_/_0.25)]"
                        : "border-border/60 bg-background/50 text-muted-foreground"
                    )}
                  >
                    {state.status === "approved" || state.status === "authorized"
                      ? "Aprovado ✔"
                      : state.status === "in_process"
                      ? "Em processamento"
                      : state.status || "Confirmado"}
                  </Badge>
                  <p className="font-body text-xs md:text-sm text-muted-foreground mt-3 leading-relaxed">
                    {state.status === "approved" || state.status === "authorized"
                      ? "Transação aprovada pela operadora. Itens liberados para a equipe de separação."
                      : "Estamos aguardando a confirmação pela operadora de cartão. Dentro de alguns minutos receberá a atualização por e-mail."}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/50 p-4 md:p-5 flex items-start gap-3">
                <Package size={16} strokeWidth={1.8} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-xs md:text-sm text-foreground font-semibold mb-1">
                    Próximos passos
                  </p>
                  <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Você receberá a nota fiscal por e-mail e, em até 2 dias úteis, o código de rastreio da transportadora.
                  </p>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "ticket" && (
            <div className="px-5 sm:px-6 md:px-8 py-7 md:py-9 space-y-5 md:space-y-6">
              <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur p-5 md:p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-transparent" />
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center">
                        <FileText size={18} strokeWidth={1.7} className="text-gold" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg md:text-xl text-foreground">
                          Boleto gerado
                        </h3>
                        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                          Vencimento em até 1 dia útil
                        </p>
                      </div>
                    </div>
                    <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                      Para continuar, abra o boleto em PDF e realize o pagamento em qualquer banco, agência ou pelo app do seu banco.
                      A confirmação ocorre em até 3 dias úteis após o pagamento.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      className="min-h-[52px] rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-primary-foreground uppercase tracking-[0.22em] text-[11px] font-bold shadow-[0_8px_28px_hsl(var(--gold)_/_0.3)] hover:shadow-[0_12px_36px_hsl(var(--gold)_/_0.4)] active:scale-[0.98] group"
                    >
                      <a
                        href={state.boletoUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          if (!state.boletoUrl) {
                            void 0;
                          }
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <ExternalLink size={14} strokeWidth={2} />
                          Abrir Boleto em PDF
                          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </a>
                    </Button>
                    {state.paymentId && (
                      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 text-center">
                        ID do pagamento: {state.paymentId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* Resumo do Pedido */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={cardVariants}
          className="rounded-3xl bg-card/35 backdrop-blur-xl border border-border/70 shadow-[0_16px_60px_hsl(var(--charcoal)_/_0.14)] overflow-hidden mb-8 md:mb-10"
        >
          <div className="px-5 sm:px-6 md:px-8 py-5 md:py-6 border-b border-border/60 flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl md:text-2xl tracking-wide text-foreground">
              Resumo do <span className="italic text-gold font-light">Pedido</span>
            </h2>
            <Badge
              variant="outline"
              className="rounded-full border-gold/30 text-gold bg-gold/5 text-[10px] md:text-[11px] px-3 py-1 uppercase tracking-[0.18em]"
            >
              {items.length} {items.length === 1 ? "item" : "itens"}
            </Badge>
          </div>

          <div className="px-5 sm:px-6 md:px-8 py-5 md:py-6 space-y-4 md:space-y-5">
            {hydrated && displayItems.length > 0 ? (
              displayItems.map((it) => (
                <div
                  key={it.key}
                  className="flex gap-4 md:gap-5 pb-4 md:pb-5 border-b border-border/55 last:border-0 last:pb-0"
                >
                  <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-card/40 border border-border/60">
                    <img
                      src={it.image}
                      alt={it.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className={`font-body text-sm md:text-base text-foreground leading-snug line-clamp-2`}>
                          {it.name}
                        </h4>
                        <p className={`font-body text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-muted-foreground/60 mt-1`}>
                          Qtd. {it.quantity} × {formatPrice(it.unit)}
                        </p>
                      </div>
                      <span className={`font-body text-sm md:text-base font-semibold text-gold tabular-nums shrink-0`}>
                        {formatPrice(it.lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className={`font-body text-sm text-muted-foreground`}>
                  Nenhum item encontrado.
                </p>
              </div>
            )}

            <Separator className="border-border/60 my-2" />

            <div className="space-y-3 md:space-y-4 pt-1">
              <div className={`flex items-center justify-between font-body text-sm md:text-base text-foreground/85`}>
                <span className={`uppercase tracking-[0.18em] text-muted-foreground`}>Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>

              <div className={`flex items-center justify-between font-body text-sm md:text-base text-foreground/85`}>
                <span className={`uppercase tracking-[0.18em] text-muted-foreground`}>Frete</span>
                {hasFreeShipping ? (
                  <span className={`tabular-nums text-gold font-medium uppercase tracking-widest text-[11px] flex items-center gap-1.5`}>
                    <Truck size={13} strokeWidth={2} /> Grátis
                  </span>
                ) : (
                  <span className="tabular-nums">{formatPrice(shipping)}</span>
                )}
              </div>

              <Separator className="border-border/60" />

              <div className="flex items-end justify-between pt-1">
                <span className="font-heading text-lg md:text-xl tracking-wide text-foreground">
                  Total
                </span>
                <p className={`font-body text-2xl md:text-3xl font-semibold text-gold tabular-nums`}>
                  {formatPrice(displayTotal)}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <a
            href={getWhatsAppLink(
              `Olá! Acabei de realizar o meu pedido na Soler Shop e quero acompanhar o status.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              try {
                navigator.vibrate?.(10);
              } catch {
                /* noop */
              }
            }}
            className={`touch-cta min-h-[44px] flex-1 sm:flex-[1.3] inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gold text-background uppercase tracking-[0.22em] text-[11px] md:text-xs font-bold py-5 hover:bg-gold-dark hover:shadow-[0_12px_40px_hsl(var(--gold)_/_0.25)] transition-all duration-500 active:scale-[0.98] group shadow-[0_8px_32px_hsl(var(--gold)_/_0.25)] relative overflow-hidden`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2.5">
              <MessageCircle size={15} strokeWidth={1.8} />
              Falar no WhatsApp
              <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </a>

          <Link
            to="/"
            onClick={() => {
              try {
                navigator.vibrate?.(6);
              } catch {
                /* noop */
              }
            }}
            className={`touch-cta min-h-[44px] flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl border border-foreground/20 bg-transparent text-foreground uppercase tracking-[0.22em] text-[11px] md:text-xs font-bold py-5 hover:bg-foreground/[0.04] hover:border-foreground/30 transition-all duration-500 active:scale-[0.98]`}
          >
            Voltar para a página inicial
          </Link>
        </motion.div>
      </main>

      {/* Mobile Sticky Bar */}
      <div
        className="md:hidden fixed bottom-3 left-3 right-3 z-[9960] rounded-2xl border border-border/15 bg-background/90 backdrop-blur-xl shadow-[0_12px_40px_hsl(var(--charcoal)_/_0.14)] p-2"
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/"
            onClick={() => {
              try {
                navigator.vibrate?.(5);
              } catch {
                /* noop */
              }
            }}
            className={`touch-cta inline-flex items-center justify-center rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-foreground border border-foreground/15 bg-foreground/[0.04] active:scale-[0.96] transition-transform duration-75 min-h-[44px]`}
          >
            Início
          </Link>
          <a
            href={getWhatsAppLink(
              `Olá! Tenho dúvidas sobre o meu pedido na Soler Shop.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              try {
                navigator.vibrate?.(10);
              } catch {
                /* noop */
              }
            }}
            className={`touch-cta inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-background bg-gold active:scale-[0.96] active:brightness-90 transition-transform duration-75 shadow-[0_2px_12px_hsl(var(--gold)_/_0.35)] min-h-[44px]`}
          >
            <MessageCircle size={14} strokeWidth={1.7} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
