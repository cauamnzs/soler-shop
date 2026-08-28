import { lazy, Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const CartDrawer = lazy(() => import("@/components/CartDrawer"));

export const CartDrawerGlobalTrigger = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener("soler:cart-drawer:open", onOpen);
    window.addEventListener("soler:cart-drawer:close", onClose);
    return () => {
      window.removeEventListener("soler:cart-drawer:open", onOpen);
      window.removeEventListener("soler:cart-drawer:close", onClose);
    };
  }, []);

  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </Suspense>
  );
};

const CartIcon = ({ className }: { className?: string }) => {
  const { count } = useCart();

  const openDrawer = () => {
    try { navigator.vibrate?.(6); } catch { /* noop */ }
    window.dispatchEvent(new CustomEvent("soler:cart-drawer:open"));
  };

  return (
    <button
      onClick={openDrawer}
      className={cn(
        "touch-cta relative w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-gold transition-lux duration-500 active:scale-90 active:text-gold rounded-lg",
        className
      )}
      aria-label={count > 0 ? `Carrinho com ${count} item(ns)` : "Carrinho vazio"}
      data-cursor-label="Carrinho"
    >
      <ShoppingCart size={20} />
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0, y: 4 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 380, damping: 18 },
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
            whileHover={{ scale: 1.12 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-background text-[9px] font-bold flex items-center justify-center font-body tracking-tight shadow-[0_0_0_2px_hsl(var(--background))] md:shadow-[0_0_0_2px_hsl(var(--card))]"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default CartIcon;
export { CartIcon };
