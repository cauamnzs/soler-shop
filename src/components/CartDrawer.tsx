import { useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, ArrowRight, Package, Truck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useCart, formatPrice, FREE_SHIPPING, parsePrice } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const DrawerItemRow = ({
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
      initial={{ opacity: 0, y: 8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, x: 30, height: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="group relative flex gap-3 md:gap-4 py-4 border-b border-border/60 last:border-0 shrink-0"
    >
      <a
        href={`/product/${item.product.id}`}
        className="touch-cta shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden bg-secondary/10 border border-border/60 md:border-border/40 active:scale-95 transition-transform"
        data-cursor-label="Abrir produto"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </a>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <a
            href={`/product/${item.product.id}`}
            className="touch-cta min-w-0 group/name"
          >
            <h4 className="font-body text-xs md:text-sm text-foreground truncate group-hover/name:text-gold transition-colors duration-300 line-clamp-2">
              {item.product.name}
            </h4>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 mt-0.5">
              {item.product.category}
            </p>
          </a>
          <button
            onClick={onRemove}
            aria-label={`Remover ${item.product.name}`}
            className="touch-cta shrink-0 w-11 h-11 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 active:scale-90 relative z-10"
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center rounded-full border border-border/70 bg-card/50 backdrop-blur-sm">
            <button
              onClick={onDecrement}
              aria-label="Diminuir quantidade"
              className="touch-cta w-11 h-11 md:w-11 md:h-11 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all duration-200 active:scale-90"
            >
              <Minus size={16} strokeWidth={2} />
            </button>
            <span className="min-w-[28px] text-center font-body text-sm md:text-base text-foreground font-semibold tabular-nums px-1">
              {item.quantity}
            </span>
            <button
              onClick={onIncrement}
              aria-label="Aumentar quantidade"
              className="touch-cta w-11 h-11 md:w-11 md:h-11 flex items-center justify-center rounded-full text-muted-foreground hover:text-gold hover:bg-gold/10 transition-all duration-200 active:scale-90"
            >
              <Plus size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="text-right">
            <p className="font-body text-xs text-muted-foreground/70 line-through tabular-nums">
              {unitPrice !== lineTotal ? formatPrice(unitPrice * (item.quantity + 0)) : undefined}
            </p>
            <p className="font-body text-sm md:text-base font-medium text-gold tabular-nums">
              {formatPrice(lineTotal)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0, transition: { delay: 0.05, duration: 0.4 } }}
    className="flex flex-col items-center justify-center py-16 px-6 text-center shrink-0"
  >
    <div className="w-20 h-20 rounded-full bg-card/60 border border-border/70 backdrop-blur-md flex items-center justify-center mb-6 shadow-soft-depth">
      <ShoppingBag size={32} strokeWidth={1.3} className="text-muted-foreground/70" />
    </div>
    <h3 className="font-heading text-2xl text-foreground mb-2">
      Seu carrinho está <span className="italic text-gold font-light">vazio</span>
    </h3>
    <p className="font-body text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
      Explore o nosso catálogo e descubra fragrâncias importadas exclusivas para começar a montar seu kit Soler.
    </p>
    <SheetClose asChild>
      <Button
        onClick={onClose}
        variant="outline"
        className="rounded-full border-gold/40 text-gold hover:bg-gold hover:text-background hover:border-gold uppercase tracking-[0.2em] text-[10px] md:text-xs px-6 py-5 transition-lux duration-500 ease-lux"
      >
        Explorar Catálogo <ArrowRight size={12} className="ml-2" />
      </Button>
    </SheetClose>
  </motion.div>
);

const FreeShippingBar = () => {
  const { subtotal, freeShippingProgress, amountToFreeShipping, hasFreeShipping } = useCart();

  const subtitle = useMemo(() => {
    if (subtotal <= 0) return `Frete grátis acima de ${formatPrice(FREE_SHIPPING)}`;
    if (hasFreeShipping) return `Você ganhou frete grátis`;
    return `Faltam ${formatPrice(amountToFreeShipping)} para o frete grátis`;
  }, [subtotal, hasFreeShipping, amountToFreeShipping]);

  return (
    <div className="w-full space-y-2.5 shrink-0">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex items-center gap-1.5 font-body text-[10px] md:text-[11px] uppercase tracking-[0.15em]",
            hasFreeShipping ? "text-gold" : "text-muted-foreground"
          )}
        >
          <Sparkles size={11} strokeWidth={2} />
          {subtitle}
        </span>
        {!hasFreeShipping && subtotal > 0 && (
          <Badge
            variant="outline"
            className="rounded-full border-gold/30 text-gold bg-gold/5 text-[10px] px-2.5 py-0.5"
          >
            {Math.round(freeShippingProgress)}%
          </Badge>
        )}
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-secondary/40 overflow-hidden border border-border/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${freeShippingProgress}%` }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light shadow-[0_0_10px_hsl(var(--gold)_/_0.45)]"
        />
      </div>
    </div>
  );
};

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
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

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.03, delayChildren: 0.02 } },
  };

  const goToCartPage = () => {
    onOpenChange(false);
    setTimeout(() => navigate("/cart"), 200);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-md md:max-w-lg !px-0 !py-0",
          "border-l border-border/70",
          "bg-background",
          "shadow-[-12px_0_60px_-12px_hsl(var(--background)_/_0.55),0_0_0_1px_hsl(var(--border)_/_0.5)]",
          "flex flex-col !h-dvh"
        )}
      >
        <motion.div variants={headerVariants} initial="hidden" animate="visible" className="shrink-0 px-5 sm:px-6 md:px-8 pt-6 md:pt-7 pb-4">
          <SheetHeader className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-heading text-2xl md:text-3xl tracking-wide text-foreground">
                Seu <span className="italic text-gold font-light">Carrinho</span>
              </SheetTitle>
              <Badge variant="outline" className="rounded-full border-gold/35 bg-gold/5 text-gold text-[10px] tracking-widest uppercase px-2.5 py-1">
                {hydrated ? `${count} ${count === 1 ? "item" : "itens"}` : "…"}
              </Badge>
            </div>
            <SheetDescription className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">
              {hydrated
                ? hasFreeShipping
                  ? "Parabéns, você garantiu o frete grátis da Soler Shop"
                  : items.length > 0
                  ? "Estamos quase lá! Ajuste as quantidades ou finalize a compra."
                  : "Adicione os produtos importados que você ama."
                : "Carregando…"}
            </SheetDescription>
            {hydrated && items.length > 0 && (
              <div className="pt-2">
                <FreeShippingBar />
              </div>
            )}
          </SheetHeader>
          <Separator className="mt-5 border-border/60" />
        </motion.div>

        {!hydrated ? (
          <div className="flex-1 flex items-center justify-center px-5 sm:px-6 md:px-8 py-16 flex-col gap-3 opacity-60">
            <Package size={28} className="text-muted-foreground/50 animate-pulse" />
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground/60">
              Sincronizando seu carrinho…
            </p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState onClose={() => onOpenChange(false)} />
        ) : (
          <ScrollArea className="flex-1 min-h-0 px-5 sm:px-6 md:px-8">
            <div className="pr-3 py-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item) => (
                  <DrawerItemRow
                    key={item.product.id}
                    item={item}
                    onIncrement={() => increment(item.product.id)}
                    onDecrement={() => decrement(item.product.id)}
                    onRemove={() => removeItem(item.product.id)}
                  />
                ))}
              </AnimatePresence>
              {items.length > 1 && (
                <div className="pt-4 pb-2 flex justify-end">
                  <button
                    onClick={clear}
                    className="touch-cta min-h-[44px] flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 hover:text-destructive transition-colors duration-300 active:scale-95 px-3"
                  >
                    <Trash2 size={12} /> Esvaziar carrinho
                  </button>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {hydrated && items.length > 0 && (
          <SheetFooter className="w-full gap-0 !px-0 !py-0 shrink-0">
            <div className="w-full border-t border-border/70 bg-background px-5 sm:px-6 md:px-8 pt-5 md:pb-6 pb-[max(2rem,env(safe-area-inset-bottom))] space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between font-body text-xs md:text-sm text-foreground/80">
                  <span className="uppercase tracking-[0.18em] text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between font-body text-xs md:text-sm text-foreground/80">
                  <span className="uppercase tracking-[0.18em] text-muted-foreground">Frete</span>
                  {hasFreeShipping ? (
                    <span className="tabular-nums text-gold font-medium uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <Truck size={13} strokeWidth={2} /> Grátis
                    </span>
                  ) : (
                    <span className="tabular-nums">{formatPrice(shipping)}</span>
                  )}
                </div>
                <Separator className="my-1 border-border/60" />
                <div className="flex items-center justify-between pt-1">
                  <span className="font-heading text-lg md:text-xl tracking-wide text-foreground">
                    Total
                  </span>
                  <span className="font-body text-xl md:text-2xl font-semibold text-gold tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Button
                  onClick={goToCartPage}
                  className="w-full bg-gold text-background uppercase tracking-[0.22em] text-[11px] md:text-xs font-bold py-5 rounded-xl hover:bg-gold-dark hover:shadow-lux-hover transition-lux duration-500 ease-lux active:scale-[0.98] group overflow-hidden relative min-h-[44px]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Revisar Carrinho Completo
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>

                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-border/70 text-muted-foreground hover:text-gold hover:border-gold/40 hover:bg-gold/5 uppercase tracking-[0.22em] text-[10px] md:text-[11px] py-4.5 transition-lux duration-500 ease-lux active:scale-[0.98] min-h-[44px]"
                  >
                    Continuar Comprando
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
