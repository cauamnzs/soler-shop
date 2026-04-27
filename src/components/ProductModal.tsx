import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, MessageCircle, ShieldCheck, Truck, Zap } from "lucide-react";
import { Product } from "@/types";
import { memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Tipo global Lenis control
declare global {
  interface Window {
    lenisControl?: {
      stop: () => void;
      start: () => void;
    };
  }
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const dragControls = useDragControls();
  const touchStartY = useRef<number>(0);
  // Modal é uma "telinha" sobre a página - scroll da página continua funcionando (catálogo)
  // Não bloqueamos o scroll do body, apenas adicionamos ESC para fechar
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !product) return;
    const prev = document.title;
    document.title = `${product.name} — Soler Shop`;
    return () => { document.title = prev; };
  }, [isOpen, product]);

  if (!product) return null;

  // Função para gerar o link do WhatsApp com os dados do produto
  const handleWhatsAppClick = () => {
    try { navigator.vibrate?.(12); } catch {}
    const message = `Olá! Gostaria de consultar a disponibilidade do ${product.name} (Ref: ${product.id}) que vi no catálogo Soler Shop.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5513991234567?text=${encodedMessage}`, "_blank");
  };

  // Portal: renderiza direto em document.body, escapando todos stacking contexts
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 md:p-8">
          {/* Overlay sólido - barreira visual absoluta (portal garante isolamento total) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-2xl"
          />

          {/* Container do Modal */}
          <motion.div
            drag={IS_MOBILE ? "y" : false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 400) onClose();
            }}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            }}
            exit={{ 
              opacity: 0, 
              y: "100%",
              transition: { duration: 0.35, ease: [0.4, 0, 1, 1] }
            }}
            style={{ originY: 1 }}
            className="relative w-full max-w-5xl bg-card border border-border md:rounded-2xl rounded-t-3xl shadow-2xl overflow-y-auto max-h-[92dvh] md:max-h-[90vh] flex flex-col md:flex-row mt-auto md:mt-0"
          >
            {/* Drag handle — mobile only */}
            <div className="md:hidden flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full bg-foreground/15" />
            </div>
            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className="touch-cta absolute top-4 right-4 z-50 w-11 h-11 flex items-center justify-center bg-background/60 hover:bg-gold/10 text-muted-foreground hover:text-gold border border-border/40 hover:border-gold/30 rounded-full transition-all duration-300 backdrop-blur-md active:scale-90"
              aria-label="Fechar Modal"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {/* Coluna da Imagem */}
            <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-auto relative overflow-hidden bg-secondary/5 flex-shrink-0">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.tag && (
                <span className="absolute top-6 left-6 bg-gold text-gold-foreground text-[10px] font-body font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Coluna de Conteúdo */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-card">
              <div className="mb-6 md:mb-8">
                <span className="text-gold font-body text-[10px] uppercase tracking-[0.4em] mb-3 md:mb-4 block opacity-60">
                  {product.category} — Ref: {product.id}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight break-words">
                  {product.name}
                </h2>
                <p className="text-2xl md:text-3xl font-body font-semibold text-gradient-gold mb-4 md:mb-6">
                  {product.price}
                </p>
                <p className="font-body text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed font-light line-clamp-4 md:line-clamp-none">
                  {product.description}
                </p>
              </div>

              {/* Gatilhos de Escassez e Confiança */}
              <div className="grid grid-cols-1 gap-3 md:gap-4 mb-8 md:mb-10">
                <div className="flex items-center gap-4 text-muted-foreground/60">
                  <ShieldCheck size={18} className="text-gold" strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-widest font-body">Autenticidade 100% Garantida</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground/60">
                  <Truck size={18} className="text-gold" strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-widest font-body">Entrega White-Glove Segura</span>
                </div>
                <div className="flex items-center gap-4 text-destructive/80 font-medium">
                  <Zap size={18} strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-widest font-body animate-pulse">Últimas unidades em estoque</span>
                </div>
              </div>

              {/* CTA Final (WhatsApp) */}
              <button
                onClick={handleWhatsAppClick}
                className="group relative flex items-center justify-center gap-4 bg-gold text-background w-full py-5 rounded-xl uppercase tracking-[0.3em] font-bold text-xs transition-all duration-500 hover:bg-gold-dark hover:shadow-gold-glow hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle size={18} />
                Desejo esta experiência
                <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-xl" />
              </button>
              
              <p className="text-center mt-6 text-[9px] text-muted-foreground uppercase tracking-widest opacity-40">
                Consultar disponibilidade e prazos de envio
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default memo(ProductModal);
