import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types";
import ProductModal from "./ProductModal";

const quickSuggestions = ["Perfume", "Body Splash", "Novo", "Limitado", "Promoção"];

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: products = [] } = useProducts();

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("soler:search:open", open as EventListener);
    return () => window.removeEventListener("soler:search:open", open as EventListener);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isProductOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isProductOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query, products]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductOpen(true);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9985] bg-background/[0.97] backdrop-blur-2xl overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mx-auto px-5 sm:px-6 pt-12 md:pt-20 pb-20"
            >
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="touch-cta absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-foreground/5 active:scale-90 active:bg-foreground/5"
                aria-label="Fechar busca"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              {/* Label */}
              <p className="text-gold/50 font-body text-[10px] uppercase tracking-[0.6em] md:tracking-[0.7em] mb-5 md:mb-6">
                Buscar
              </p>

              {/* Input */}
              <div className="relative mb-6 md:mb-14">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nome, categoria..."
                  className="w-full bg-transparent border-0 border-b-2 border-foreground/10 focus:border-gold text-foreground font-heading text-[1.45rem] sm:text-4xl md:text-5xl pb-4 focus:outline-none placeholder:text-muted-foreground/10 transition-colors duration-500 caret-gold"
                  autoComplete="off"
                  spellCheck={false}
                />
                <Search
                  className="absolute right-0 bottom-5 text-gold/30"
                  size={22}
                  strokeWidth={1.5}
                />
              </div>

              {!query.trim() && (
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap mb-8 md:mb-10 -mx-1 px-1">
                  {quickSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => { try { navigator.vibrate?.(4); } catch {}; setQuery(suggestion); }}
                      className="touch-cta shrink-0 px-4 py-2.5 rounded-full border border-foreground/10 bg-foreground/[0.02] text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors duration-300 font-body text-[10px] uppercase tracking-[0.2em] active:scale-95 active:border-gold/40"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Results / States */}
              <AnimatePresence mode="wait">
                {results.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground/35 mb-5">
                      {results.length} resultado{results.length !== 1 ? "s" : ""}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                      {results.map((product, i) => (
                        <motion.button
                          key={product.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.35,
                            delay: i * 0.055,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          onClick={() => { try { navigator.vibrate?.(6); } catch {}; handleProductClick(product); }}
                          className="touch-cta text-left flex flex-col gap-2 p-3 rounded-xl border border-border/20 hover:border-gold/35 bg-background/40 hover:bg-gold/[0.03] transition-all duration-300 group active:scale-[0.97]"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden bg-secondary/10">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <p className="font-body text-xs text-foreground leading-snug line-clamp-2">
                            {product.name}
                          </p>
                          <p className="font-body text-xs font-medium text-gold">
                            {product.price}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : query.trim() ? (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-14"
                  >
                    <p className="font-heading text-2xl text-muted-foreground/25 mb-2">
                      Nenhum resultado
                    </p>
                    <p className="font-body text-xs text-muted-foreground/25 uppercase tracking-[0.3em]">
                      para &ldquo;{query}&rdquo;
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="font-body text-xs text-muted-foreground/20 uppercase tracking-[0.35em]">
                      {products.length > 0
                        ? `${products.length} produtos disponíveis — comece a digitar`
                        : "Carregando catálogo..."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product detail modal from search result */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductOpen}
        onClose={() => setIsProductOpen(false)}
      />
    </>,
    document.body
  );
};

export default SearchModal;
