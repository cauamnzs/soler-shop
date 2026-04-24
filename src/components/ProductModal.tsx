import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ShieldCheck, Truck, Zap } from "lucide-react";
import { Product } from "@/types";
import { memo, useEffect } from "react";
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

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  // Modal é uma "telinha" sobre a página - scroll da página continua funcionando (catálogo)
  // Não bloqueamos o scroll do body, apenas adicionamos ESC para fechar
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);


  if (!product) return null;

  // Função para gerar o link do WhatsApp com os dados do produto
  const handleWhatsAppClick = () => {
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9, 
              y: 10,
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }}
            className="relative w-full max-w-5xl bg-card border border-border rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col md:flex-row"
          >
            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-muted/50 hover:bg-muted text-foreground rounded-full transition-colors backdrop-blur-md"
              aria-label="Fechar Modal"
            >
              <X size={20} />
            </button>

            {/* Coluna da Imagem */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-auto relative overflow-hidden bg-secondary/5">
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
                <p className="text-xl md:text-2xl font-body font-medium text-foreground/80 mb-4 md:mb-6">
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
