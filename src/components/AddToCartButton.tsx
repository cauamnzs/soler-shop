import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Plus, Loader2 } from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

type Variant = "primary" | "secondary";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: Variant;
  className?: string;
  onAdd?: (product: Product, qty: number) => void;
}

const AddToCartButton = ({
  product,
  quantity = 1,
  variant = "primary",
  className,
  onAdd,
}: AddToCartButtonProps) => {
  const [phase, setPhase] = useState<"idle" | "adding" | "success">("idle");
  const navigate = useNavigate();
  const { addItem } = useCart();

  const goToCart = () => {
    window.dispatchEvent(new CustomEvent("soler:cart-drawer:open"));
  };

  const handleClick = async () => {
    if (phase !== "idle") {
      if (phase === "success") goToCart();
      return;
    }

    setPhase("adding");

    // Latência UX (180ms) — feedback humano antes de aplicar o state
    await new Promise((r) => setTimeout(r, 180));

    try {
      const qty = Math.max(1, Math.floor(quantity) || 1);
      addItem(product, qty);

      // Callback opcional injetado
      onAdd?.(product, qty);

      toast({
        title: "Adicionado ao carrinho ✨",
        description: `${product.name} — Qtd: ${qty}`,
        action: (
          <button
            onClick={goToCart}
            className="rounded-full bg-gold text-background px-4 py-2 text-[10px] uppercase tracking-widest font-semibold active:scale-95 transition-transform"
          >
            Ver
          </button>
        ),
      });

      setPhase("success");
      window.setTimeout(() => setPhase("idle"), 2600);
    } catch {
      setPhase("idle");
      toast({
        title: "Não foi possível adicionar",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    }
  };

  const isPrimary = variant === "primary";

  const baseIdleCls = isPrimary
    ? "bg-gold text-background shadow-[0_8px_30px_hsl(var(--gold)_/_0.32)] hover:bg-gold-dark hover:shadow-lux-hover"
    : "bg-transparent text-gold border-2 border-gold/40 hover:border-gold hover:bg-gold hover:text-background";

  const successCls =
    "bg-gold text-background shadow-[0_8px_30px_hsl(var(--gold)_/_0.45)] hover:bg-gold-dark hover:shadow-lux-hover";

  const addingCls = isPrimary
    ? "bg-gold/80 text-background/70 cursor-wait"
    : "bg-gold/10 text-gold/60 border-gold/30 border-2 cursor-wait";

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={phase === "adding"}
      whileTap={{ scale: phase === "idle" ? 0.98 : 1 }}
      whileHover={{ scale: phase === "idle" ? 1.015 : 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative w-full flex items-center justify-center gap-3",
        "py-4.5 md:py-5 rounded-xl uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-[11px] md:text-xs",
        "transition-all duration-500 ease-lux overflow-hidden",
        "touch-cta select-none",
        phase === "idle" && baseIdleCls,
        phase === "adding" && addingCls,
        phase === "success" && successCls,
        className
      )}
      aria-label={
        phase === "success"
          ? "Ir para o carrinho"
          : phase === "adding"
          ? "Adicionando produto..."
          : `Adicionar ${product.name} ao carrinho`
      }
    >
      {/* Shimmer sweep (idle primary only) */}
      {phase === "idle" && isPrimary && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-lux pointer-events-none rounded-xl" />
      )}

      {phase === "idle" && (
        <>
          <ShoppingCart size={18} className="relative z-10" strokeWidth={1.8} />
          <span className="relative z-10">
            Adicionar ao Carrinho
          </span>
          <Plus
            size={16}
            strokeWidth={2.4}
            className="relative z-10 md:opacity-0 md:-translate-x-1 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-500"
          />
        </>
      )}

      {phase === "adding" && (
        <>
          <Loader2 size={18} className="animate-spin" strokeWidth={2} />
          <span>Adicionando…</span>
        </>
      )}

      {phase === "success" && (
        <>
          <Check size={18} strokeWidth={2.4} />
          <span>No carrinho! Clique p/ ver →</span>
        </>
      )}
    </motion.button>
  );
};

export default AddToCartButton;
