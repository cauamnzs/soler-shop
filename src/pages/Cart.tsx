import { lazy, Suspense, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, Shield, Truck, CreditCard, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useNavigate } from "react-router-dom";
import { useCart, formatPrice, FREE_SHIPPING, parsePrice } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { getWhatsAppLink } from "@/lib/envConfig";

const Footer = lazy(() => import("@/components/Footer"));

/* ══════════════════════════════════════════════════════════════════
   LINHA DO ITEM (PADRÃO — para Cart page)
   ══════════════════════════════════════════════════════════════════ */

const PageItemRow = ({
  item,
  onDecrement,
  onIncrement,
  onRemove,
}: {
  item: ReturnType<typeof useCart>["items"][number];
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
}) => {
  const unitPrice = parsePrice(item.product.price);
  const lineTotal = unitPrice * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } }}
      exit={{ opacity: 0, x: 40, height: 0, marginTop: 0, marginBottom: 0, transition: { duration: 0.22 } }}
      className="group relative flex gap-4 sm:gap-5 md:gap-6 py-5 md:py-6 border-b border-border/60 last:border-0"
    >
      {/* Imagem — glassy frame */}
      <Link
        to={`/product/${item.product.id}`}
        data-cursor-label="Abrir produto"
        className="touch-cta shrink-0 relative w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm border border-border/60 md:border-border/50 group-hover:border-gold/35 group-hover:shadow-lux active:scale-[0.98] transition-all duration-500 ease-lux"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
        />
        {/* Tag */}
        {item.product.tag && (
          <span className="absolute top-2.5 left-2.5 text-[9px] font-body font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-foreground/10 text-foreground/75">
            {item.product.tag}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2 md:mb-3">
          <Link to={`/product/${item.product.id}`} className="min-w-0 group/name touch-cta">
            <h3 className="font-body text-sm md:text-base text-foreground leading-snug group-hover/name:text-gold transition-colors duration-400 line-clamp-2 md:line-clamp-1">
              {item.product.name}
            </h3>
            <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-muted-foreground/55 mt-1">
              {item.product.category}
            </p>
          </Link>
          <button
            onClick={onRemove}
            aria-label={`Remover ${item.product.name}`}
            className="touch-cta shrink-0 p-2 rounded-full text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 active:scale-90"
          >
            <Trash2 size={16} strokeWidth={1.7} />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4">
          {/* Qty controls (glass) */}
          <div className="flex items-center rounded-full border border-border/70 bg-card/50 backdrop-blur-md shadow-sm">
            <button
              onClick={onDecrement}
              aria-label="Diminuir quantidade"
              className="touch-cta w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all duration-300 active:scale-90"
            >
              <Minus size={14} strokeWidth={2.1} />
            </button>
            <span className="min-w-[26px] text-center font-body text-sm md:text-base text-foreground font-semibold tabular-nums px-1">
              {item.quantity}
            </span>
            <button
              onClick={onIncrement}
              aria-label="Aumentar quantidade"
              className="touch-cta w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-gold hover:bg-gold/10 transition-all duration-300 active:scale-90"
            >
              <Plus size={14} strokeWidth={2.1} />
            </button>
          </div>

          {/* Price block */}
          <div className="text-right">
            {item.quantity > 1 && (
              <p className="font-body text-[10px] md:text-xs text-muted-foreground/50 tabular-nums">
                {formatPrice(unitPrice)} un.
              </p>
            )}
            <p className="font-body text-base md:text-lg font-semibold text-gold tabular-nums">
              {formatPrice(lineTotal)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   FRETE GRÁTIS — BARRA (padrão Drawer + Page compartilhado)
   ══════════════════════════════════════════════════════════════════ */

const FreeShippingBar = () => {
  const { subtotal, freeShippingProgress, amountToFreeShipping, hasFreeShipping } = useCart();

  const subtitle = useMemo(() => {
    if (subtotal <= 0) return `Frete grátis acima de ${formatPrice(FREE_SHIPPING)}`;
    if (hasFreeShipping) return "Você garantiu o frete grátis! 🎉";
    return `Faltam ${formatPrice(amountToFreeShipping)} para o frete grátis`;
  }, [subtotal, hasFreeShipping, amountToFreeShipping]);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className={cn(
            "flex items-center gap-2 font-body text-[11px] md:text-xs uppercase tracking-[0.18em]",
            hasFreeShipping ? "text-gold" : "text-muted-foreground"
          )}
        >
          <Sparkles size={12} strokeWidth={2} />
          {subtitle}
        </span>
        {!hasFreeShipping && subtotal > 0 && (
          <Badge variant="outline" className="rounded-full border-gold/30 text-gold bg-gold/5 text-[10px] px-3 py-1">
            {Math.round(freeShippingProgress)}% completo
          </Badge>
        )}
      </div>
      <div className="relative h-2 w-full rounded-full bg-secondary/35 overflow-hidden border border-border/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${freeShippingProgress}%` }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            hasFreeShipping
              ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light shadow-[0_0_16px_hsl(var(--gold)_/_0.55)]"
              : "bg-gradient-to-r from-gold-dark via-gold to-gold-light shadow-[0_0_14px_hsl(var(--gold)_/_0.5)]"
          )}
        />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   CART PAGE PRINCIPAL — bg-background (REGRA RÍGIDA)
   ══════════════════════════════════════════════════════════════════ */

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const summaryVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] } },
};

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    count,
    subtotal,
    shipping,
    total,
    hasFreeShipping,
    hydrated,
    increment,
    decrement,
    removeItem,
    clear,
  } = useCart();

  const goCheckout = () => {
    try { navigator.vibrate?.(10); } catch { /* noop */ }
    navigate("/checkout");
  };

  const goShopping = () => navigate("/");

  return (
    <div className="min-h-screen relative bg-background selection:bg-gold/20 overflow-x-hidden">
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto section-padding pt-10 md:pt-14 lg:pt-20 pb-20 md:pb-28">
        {/* Cabeçalho */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="text-center mb-10 md:mb-14 lg:mb-16 px-2"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-10 h-[1px] bg-gold/50 block" />
            <span className="w-1.5 h-1.5 bg-gold/60 rotate-45 inline-block" />
            <span className="w-10 h-[1px] bg-gold/50 block" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-3">
            Seu <span className="italic text-gold font-light">Carrinho</span>
          </h1>
          <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground font-light">
            {hydrated
              ? count > 0
                ? `${count} ${count === 1 ? "produto selecionado" : "produtos selecionados"}`
                : "Monte o seu kit Soler"
              : "Preparando…"}
          </p>
        </motion.header>

        {/* Empty State */}
        {hydrated && items.length === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.05, duration: 0.6 } }}
            className="max-w-2xl mx-auto py-14 md:py-20 flex flex-col items-center text-center px-4"
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-card/40 border border-border/70 backdrop-blur-md flex items-center justify-center mb-8 shadow-soft-depth">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/10 via-transparent to-gold/5 blur-xl pointer-events-none" />
              <ShoppingBag size={36} strokeWidth={1.2} className="text-muted-foreground/60 relative z-10" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
              Carrinho <span className="italic text-gold font-light">vazio</span>
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Ainda não há produtos por aqui. Volte para a página inicial e descubra fragrâncias importadas, body splashes exclusivos e kits premium para a sua rotina.
            </p>
            <Button
              onClick={goShopping}
              className="bg-gold text-background uppercase tracking-[0.22em] text-[11px] md:text-xs font-bold px-8 py-5 rounded-full hover:bg-gold-dark hover:shadow-lux-hover transition-lux duration-500 ease-lux active:scale-[0.98] group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Explorar Catálogo
                <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Button>
          </motion.section>
        )}

        {/* Grid: Itens (2/3) + Summary Sticky (1/3) */}
        {hydrated && items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px] gap-6 md:gap-8 lg:gap-10 items-start">
            {/* Coluna 1 — Itens */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.05 } }}
              className="rounded-3xl bg-card/30 backdrop-blur-md border border-border/60 md:border-border/50 shadow-soft-depth overflow-hidden"
            >
              <ScrollArea className="max-h-[calc(100dvh-220px)] md:max-h-[calc(100dvh-240px)] lg:max-h-none lg:overflow-visible">
                <div className="px-5 sm:px-6 md:px-8 pt-5 md:pt-6 pb-3">
                  <FreeShippingBar />
                </div>
                <Separator className="mx-5 sm:mx-6 md:mx-8 my-3 border-border/60" />
                <div className="px-5 sm:px-6 md:px-8 pb-6 md:pb-8">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {items.map((item) => (
                      <PageItemRow
                        key={item.product.id}
                        item={item}
                        onIncrement={() => increment(item.product.id)}
                        onDecrement={() => decrement(item.product.id)}
                        onRemove={() => removeItem(item.product.id)}
                      />
                    ))}
                  </AnimatePresence>
                  {items.length > 1 && (
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={clear}
                        className="touch-cta flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.22em] text-muted-foreground/55 hover:text-destructive transition-colors duration-300 active:scale-95"
                      >
                        <Trash2 size={13} /> Esvaziar carrinho
                      </button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.section>

            {/* Coluna 2 — Summary Sticky (glass) */}
            <motion.aside
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={summaryVariants}
              className="sticky top-28 md:top-32 lg:top-36 z-20"
            >
              <div className="rounded-3xl bg-card/35 backdrop-blur-xl border border-border/70 shadow-soft-depth overflow-hidden">
                {/* Header do summary */}
                <div className="px-5 sm:px-6 md:px-7 py-5 md:py-6 border-b border-border/60 bg-gradient-to-br from-gold/8 via-transparent to-transparent">
                  <h2 className="font-heading text-xl md:text-2xl tracking-wide text-foreground">
                    Resumo do <span className="italic text-gold font-light">Pedido</span>
                  </h2>
                  <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-muted-foreground/60 mt-1.5">
                    {count} {count === 1 ? "item" : "itens"}
                  </p>
                </div>

                {/* Valores */}
                <div className="px-5 sm:px-6 md:px-7 py-5 md:py-6 space-y-4">
                  <div className="flex items-center justify-between font-body text-sm md:text-base text-foreground/85">
                    <span className="uppercase tracking-[0.18em] text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between font-body text-sm md:text-base text-foreground/85">
                    <span className="uppercase tracking-[0.18em] text-muted-foreground">Frete</span>
                    {hasFreeShipping ? (
                      <span className="tabular-nums text-gold font-medium uppercase tracking-widest text-[11px] flex items-center gap-1.5">
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
                    <div className="text-right">
                      {!hasFreeShipping && subtotal > 0 && (
                        <p className="font-body text-[10px] md:text-[11px] text-muted-foreground/60 mb-0.5 uppercase tracking-widest">
                          + frete calculado
                        </p>
                      )}
                      <p className="font-body text-2xl md:text-3xl font-semibold text-gold tabular-nums">
                        {formatPrice(total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Checkout Dourado — Botão PREMIUM (REGRA RÍGIDA) */}
                <div className="px-5 sm:px-6 md:px-7 pb-2">
                  <Button
                    onClick={goCheckout}
                    className="w-full bg-gold text-background uppercase tracking-[0.22em] md:tracking-[0.28em] text-[11px] md:text-xs font-bold py-5 md:py-6 rounded-2xl hover:bg-gold-dark hover:shadow-lux-hover transition-lux duration-500 ease-lux active:scale-[0.98] group relative overflow-hidden shadow-[0_8px_32px_hsl(var(--gold)_/_0.25)]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 ease-lux pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center gap-2.5 md:gap-3">
                      Finalizar Compra
                      <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>

                {/* Trust badges (glassmorphism) */}
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

              {/* Link continuar comprando */}
              <div className="mt-5 md:mt-6 flex justify-center">
                <Link
                  to="/"
                  data-cursor-label="Continuar comprando"
                  className="touch-cta group inline-flex items-center gap-2 font-body text-[11px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-gold transition-colors duration-400 active:scale-95"
                >
                  <Package size={13} strokeWidth={1.7} />
                  Continuar comprando
                  <ArrowRight size={12} className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </main>

      {/* Footer Suspense lazy (mantém padrão PACOTE P) */}
      <Suspense fallback={<div style={{ minHeight: "16rem" }} />}>
        <Footer />
      </Suspense>

      {/* Mobile Sticky CTA Bar */}
      <div
        className="md:hidden fixed bottom-3 left-3 right-3 z-[9960] rounded-2xl border border-border/15 bg-background/90 dark:bg-background/95 backdrop-blur-xl shadow-2xl p-2"
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/#products"
            onClick={() => { try { navigator.vibrate?.(6); } catch {} }}
            className="touch-cta inline-flex items-center justify-center rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-foreground border border-foreground/15 bg-foreground/[0.04] active:scale-[0.96] active:bg-foreground/[0.08] transition-transform duration-75 min-h-[44px]"
          >
            Ver Catálogo
          </Link>
          <a
            href={getWhatsAppLink("Olá! Estou com dúvidas sobre o meu carrinho na Soler Shop.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { try { navigator.vibrate?.(10); } catch {} }}
            className="touch-cta inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-background bg-gold active:scale-[0.96] active:brightness-90 transition-transform duration-75 shadow-[0_2px_12px_hsl(var(--gold)_/_0.35)] min-h-[44px]"
          >
            <MessageCircle size={14} strokeWidth={1.7} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cart;
