import { lazy, Suspense, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import {
  XCircle,
  RefreshCw,
  MessageCircle,
  ArrowLeft,
  CreditCard as CardIcon,
  FileText,
  AlertTriangle,
  Shield,
  Truck,
} from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getWhatsAppLink } from "@/lib/envConfig";
import { cn } from "@/lib/utils";

const Header = lazy(() => import("@/components/Header"));

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

type BadgeKind = "destructive" | "warning" | "muted";

type ReasonHint = {
  badge: BadgeKind;
  badgeLabel: string;
  title: string;
  body: string;
  icon: typeof AlertTriangle;
};

const OrderFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason") ?? "";

  const hint: ReasonHint = useMemo(() => {
    switch (reason) {
      case "card_declined":
      case "rejected":
        return {
          badge: "destructive" as BadgeKind,
          badgeLabel: `Cartão recusado`,
          title: `Cartão recusado`,
          body:
            `Tente outro cartão, escolha Pix ou Boleto. Também verifique os dados e o limite disponível.`,
          icon: CardIcon,
        };
      case "pix_expired":
        return {
          badge: "warning" as BadgeKind,
          badgeLabel: "QR expirado",
          title: "QR Code do Pix expirado",
          body:
            "A validade de 15 minutos passou. Clique em Tentar Novamente para gerar um novo QR Code.",
          icon: AlertTriangle,
        };
      case "processing":
        return {
          badge: "warning" as BadgeKind,
          badgeLabel: `Em análise`,
          title: "Pagamento em processamento",
          body:
            `Seu pagamento ainda está sendo analisado. Aguarde alguns minutos ou consulte o e-mail cadastrado.`,
          icon: FileText,
        };
      default:
        return {
          badge: "muted" as BadgeKind,
          badgeLabel: "Erro desconhecido",
          title: "Erro desconhecido",
          body:
            "Entre em contato com o nosso suporte que vamos resolver rapidinho.",
          icon: AlertTriangle,
        };
    }
  }, [reason]);

  const badgeClassName = cn(
    "rounded-full px-3 py-1 text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-semibold border",
    hint.badge === "destructive" &&
      "border-destructive/40 bg-destructive/10 text-destructive",
    hint.badge === "warning" &&
      "border-gold/40 bg-gold/10 text-gold",
    hint.badge === "muted" &&
      "border-border/70 bg-muted/40 text-muted-foreground"
  );

  const HintIcon = hint.icon;

  const handleRetry = () => {
    try {
      navigator.vibrate?.(10);
    } catch {
      /* noop */
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen relative bg-background selection:bg-destructive/15 overflow-x-hidden">
      <Suspense fallback={<div className="h-16 md:h-20 lg:h-24" />}>
        <Header />
      </Suspense>

      <main className="relative z-10 max-w-3xl mx-auto section-padding pt-14 pb-32">
        {/* Hero da Falha */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="text-center mb-10 md:mb-12 px-2"
        >
          <div className="relative inline-flex items-center justify-center mb-8">
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-destructive/15 blur-3xl"
              style={{ width: 180, height: 180 }}
            />
            <div
              className="relative rounded-full bg-card/35 backdrop-blur-xl border border-destructive/30 flex items-center justify-center shadow-[0_12px_48px_hsl(var(--charcoal)_/_0.14)]"
              style={{ width: 140, height: 140 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: 15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 18 }}
                className="rounded-full bg-destructive/95 shadow-[inset_0_2px_8px_hsl(var(--destructive)_/_0.35),0_6px_20px_hsl(var(--destructive)_/_0.3)] flex items-center justify-center"
                style={{ width: 92, height: 92 }}
              >
                <XCircle size={52} strokeWidth={1.5} className="text-background" />
              </motion.div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-10 h-[1px] bg-destructive/40 block" />
            <span className="w-1.5 h-1.5 bg-destructive/60 rotate-45 inline-block" />
            <span className="w-10 h-[1px] bg-destructive/40 block" />
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground mb-4">
            Não conseguimos processar seu pagamento
          </h1>
          <p className={`font-body text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed`}>
            Tente novamente com outro método ou entre em contato que ajudamos.
          </p>
        </motion.section>

        {/* Hint Inteligente */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={cardVariants}
          className={cn(
            "rounded-3xl backdrop-blur-xl border shadow-[0_16px_60px_hsl(var(--charcoal)_/_0.14)] overflow-hidden mb-8 md:mb-10",
            hint.badge === "destructive"
              ? "bg-card/35 border-destructive/25"
              : hint.badge === "warning"
                ? "bg-card/35 border-gold/25"
                : "bg-card/35 border-border/70"
          )}
        >
          <div
            className={cn(
              "px-5 sm:px-6 md:px-8 py-5 md:py-6 border-b flex items-center justify-between gap-3 flex-wrap",
              hint.badge === "destructive"
                ? "border-destructive/20 bg-gradient-to-br from-destructive/8 via-transparent to-transparent"
                : hint.badge === "warning"
                  ? "border-gold/20 bg-gradient-to-br from-gold/8 via-transparent to-transparent"
                  : "border-border/60 bg-gradient-to-br from-muted/8 via-transparent to-transparent"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl border flex items-center justify-center",
                  hint.badge === "destructive" &&
                    "bg-destructive/12 border-destructive/30",
                  hint.badge === "warning" &&
                    "bg-gold/12 border-gold/30",
                  hint.badge === "muted" &&
                    "bg-muted/40 border-border/60"
                )}
              >
                <HintIcon
                  size={18}
                  strokeWidth={1.7}
                  className={cn(
                    hint.badge === "destructive" && "text-destructive",
                    hint.badge === "warning" && "text-gold",
                    hint.badge === "muted" && "text-muted-foreground"
                  )}
                />
              </div>
              <div>
                <h2
                  className={cn(
                    "font-heading text-lg md:text-xl tracking-wide text-foreground"
                  )}
                >
                  {hint.title}
                </h2>
              </div>
            </div>
            <span className={badgeClassName}>{hint.badgeLabel}</span>
          </div>

          <div className="px-5 sm:px-6 md:px-8 py-6 md:py-7">
            <div
              className={cn(
                "rounded-2xl border p-4 md:p-5 flex items-start gap-3.5",
                hint.badge === "destructive" &&
                  "border-destructive/20 bg-destructive/[0.05]",
                hint.badge === "warning" &&
                  "border-gold/20 bg-gold/[0.05]",
                hint.badge === "muted" &&
                  "border-border/50 bg-background/40"
              )}
            >
              <AlertTriangle
                size={17}
                strokeWidth={1.8}
                className={cn(
                  "shrink-0 mt-0.5",
                  hint.badge === "destructive" && "text-destructive",
                  hint.badge === "warning" && "text-gold",
                  hint.badge === "muted" && "text-muted-foreground"
                )}
              />
              <p className={`font-body text-sm md:text-base text-foreground/85 leading-relaxed`}>
                {hint.body}
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3 mb-8 md:mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={handleRetry}
              className="min-h-[44px] flex-1 sm:flex-[1.2] bg-gold text-background uppercase tracking-[0.22em] text-[11px] md:text-xs font-bold py-5 rounded-2xl hover:bg-gold-dark hover:shadow-[0_12px_40px_hsl(var(--gold)_/_0.25)] transition-all duration-500 active:scale-[0.98] group shadow-[0_8px_32px_hsl(var(--gold)_/_0.25)] relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 pointer-events-none" />
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                <RefreshCw
                  size={14}
                  strokeWidth={1.9}
                  className="transition-transform duration-500 group-hover:rotate-[320deg]"
                />
                Tentar novamente
              </span>
            </Button>

            <a
              href={getWhatsAppLink(
                `Olá! Tive um problema com o pagamento do meu pedido na Soler Shop.`
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
              className={`touch-cta min-h-[44px] flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl border border-foreground/20 bg-transparent text-foreground uppercase tracking-[0.22em] text-[11px] md:text-xs font-bold py-5 hover:bg-foreground/[0.04] hover:border-foreground/30 transition-all duration-500 active:scale-[0.98]`}
            >
              <MessageCircle size={15} strokeWidth={1.8} />
              Falar no WhatsApp
            </a>
          </div>

          <div className="flex justify-center pt-1">
            <Link
              to="/cart"
              onClick={() => {
                try {
                  navigator.vibrate?.(6);
                } catch {
                  /* noop */
                }
              }}
              className={`touch-cta min-h-[44px] group inline-flex items-center gap-2 font-body text-[11px] md:text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors duration-400 active:scale-95 py-2`}
            >
              <ArrowLeft
                size={13}
                strokeWidth={1.8}
                className="transition-transform duration-400 group-hover:-translate-x-1"
              />
              Voltar para o carrinho
            </Link>
          </div>
        </motion.div>

        <Separator className="border-border/50 mb-8 md:mb-10" />

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
        >
          <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-3xl bg-card/35 backdrop-blur-xl border border-border/60 shadow-[0_4px_24px_hsl(var(--charcoal)_/_0.14)]">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-gold/12 border border-gold/30 flex items-center justify-center">
              <Shield size={20} strokeWidth={1.7} className="text-gold" />
            </div>
            <div className="min-w-0">
              <p className={`font-body text-[11px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground`}>
                Pagamento
              </p>
              <p className="font-heading text-sm md:text-base text-foreground">
                Seguro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-3xl bg-card/35 backdrop-blur-xl border border-border/60 shadow-[0_4px_24px_hsl(var(--charcoal)_/_0.14)]">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-gold/12 border border-gold/30 flex items-center justify-center">
              <MessageCircle size={20} strokeWidth={1.7} className="text-gold" />
            </div>
            <div className="min-w-0">
              <p className={`font-body text-[11px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground`}>
                Suporte
              </p>
              <p className="font-heading text-sm md:text-base text-foreground">
                WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-3xl bg-card/35 backdrop-blur-xl border border-border/60 shadow-[0_4px_24px_hsl(var(--charcoal)_/_0.14)]">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-gold/12 border border-gold/30 flex items-center justify-center">
              <Truck size={20} strokeWidth={1.7} className="text-gold" />
            </div>
            <div className="min-w-0">
              <p className={`font-body text-[11px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground`}>
                Frete
              </p>
              <p className="font-heading text-sm md:text-base text-foreground">
                Grátis
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Mobile Sticky Bar */}
      <div
        className="md:hidden fixed bottom-3 left-3 right-3 z-[9960] rounded-2xl border border-border/15 bg-background/90 backdrop-blur-xl shadow-[0_12px_40px_hsl(var(--charcoal)_/_0.14)] p-2"
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/cart"
            onClick={() => {
              try {
                navigator.vibrate?.(5);
              } catch {
                /* noop */
              }
            }}
            className={`touch-cta inline-flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-foreground border border-foreground/15 bg-foreground/[0.04] active:scale-[0.96] transition-transform duration-75 min-h-[44px]`}
          >
            <ArrowLeft size={12} strokeWidth={1.9} />
            Carrinho
          </Link>
          <button
            onClick={handleRetry}
            className={`touch-cta inline-flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-background bg-gold active:scale-[0.96] active:brightness-90 transition-transform duration-75 shadow-[0_2px_12px_hsl(var(--gold)_/_0.35)] min-h-[44px]`}
          >
            <RefreshCw size={12} strokeWidth={1.9} />
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFailure;
