import { motion, Variants, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";
import { useState, memo, useMemo } from "react";
import { Product } from "@/types";
import ProductModal from "./ProductModal";
import { useProducts } from "@/hooks/useProducts";

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: products = [], isLoading, isError } = useProducts();
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filterOptions = useMemo(() => {
    if (!products.length) return ["Todos"];
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))] as string[];
    const tags = [...new Set(products.map(p => p.tag).filter(Boolean))] as string[];
    return ["Todos", ...cats, ...tags];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "Todos") return products;
    return products.filter(p => p.category === activeFilter || p.tag === activeFilter);
  }, [products, activeFilter]);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Não limpa o selectedProduct imediatamente para manter a animação de saída estável
  };

  // Animação de entrada do título
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Animação do grid (Cascata)
  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1
      },
    },
  };

  // Animação de cada produto individual
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="products" className="relative py-12 md:py-20 bg-background/50">
      {/* Fade superior suave - continuação de SensationVibes */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-0" />
      {/* Fade inferior suave - transição para WhyChoose */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto section-padding relative z-10">
        
        {/* Cabeçalho */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="flex flex-col items-center mb-10 md:mb-16 px-4"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-[1px] bg-gold/60 block" />
            <span className="w-1.5 h-1.5 bg-gold/60 rotate-45 inline-block" />
            <span className="w-6 h-[1px] bg-gold/60 block" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center text-foreground mb-4 break-words">
            Nossos <span className="italic text-gold font-light">Favoritos</span>
          </h2>
          <p className="text-center text-muted-foreground font-body text-xs sm:text-sm md:text-base uppercase tracking-[0.4em] font-light max-w-lg">
            Seleção exclusiva de importados
          </p>
        </motion.div>

        {/* Filter Pills */}
        {!isLoading && !isError && filterOptions.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-2 justify-center mb-10 md:mb-14 px-4"
          >
            {filterOptions.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-4 py-2 rounded-full font-body text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 overflow-hidden ${
                  activeFilter === filter
                    ? "text-background"
                    : "text-muted-foreground hover:text-foreground border border-foreground/10 hover:border-gold/30"
                }`}
              >
                {activeFilter === filter && (
                  <motion.span
                    layoutId="filter-active-pill"
                    className="absolute inset-0 bg-gold rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative">{filter}</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Skeleton de Carregamento */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-square rounded-xl animate-shimmer mb-5" />
                <div className="flex flex-col items-center gap-2 px-2">
                  <div className="h-3.5 w-2/3 rounded-full animate-shimmer" />
                  <div className="h-3 w-1/2 rounded-full animate-shimmer" />
                  <div className="h-4 w-1/3 rounded-full animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center mb-10 md:mb-14">
            <p className="text-destructive font-body text-xs sm:text-sm md:text-base uppercase tracking-[0.15em]">
              Não foi possível carregar os produtos agora.
            </p>
          </div>
        )}

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16 group/grid"
        >
          <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.22 } }}
              data-cursor-label="Explorar"
              onClick={() => openModal(product)}
              className="group cursor-pointer flex flex-col transition-all duration-300 ease-out hover:-translate-y-1 group-hover/grid:opacity-50 hover:!opacity-100"
            >
              {/* Box da Imagem */}
              <div className="relative aspect-square overflow-hidden bg-secondary/10 rounded-xl mb-5 shadow-sm group-hover:shadow-xl transition-all duration-500 border border-border/40 group-hover:border-gold/25">
                <img
                  src={product.image}
                  alt={`Imagem do produto ${product.name}`}
                  width="600"
                  height="600"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] group-hover:scale-105"
                />
                {/* Shimmer sweep on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-lux z-[1] pointer-events-none" />
                
                {/* Tag de Destaque */}
                {product.tag && (
                  <span className={`absolute top-3 left-3 backdrop-blur-md text-[10px] font-body font-medium uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border ${
                    product.tag === "Novo"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                      : product.tag === "Limitado"
                      ? "bg-gold/15 text-gold border-gold/25"
                      : "bg-background/80 text-foreground/80 border-foreground/8 backdrop-blur-md"
                  }`}>
                    {product.tag === "Novo" ? (
                      <span className="inline-flex items-center gap-1">
                        Novo<span className="text-[7px] animate-pulse opacity-60">✦</span>
                      </span>
                    ) : product.tag}
                  </span>
                )}
                
                {/* Botão de Detalhes (Catálogo) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(product);
                  }}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-background/70 backdrop-blur-md border border-foreground/10 text-foreground p-3.5 sm:p-3 rounded-full
                    opacity-100 sm:opacity-0 translate-y-0 sm:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-500 ease-out hover:bg-gold hover:text-background hover:border-gold hover:scale-110 shadow-lg active:scale-95"
                  aria-label={`Ver detalhes de ${product.name}`}
                >
                  <Eye size={20} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                </button>
              </div>

              {/* Textos do Produto (Minimalista) */}
              <div className="flex flex-col items-center text-center px-2">
                <h3 className="font-body text-sm md:text-base font-light text-muted-foreground leading-snug mb-1.5 transition-colors duration-300 group-hover:text-foreground">
                  {product.name}
                </h3>
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 mb-2">
                  {product.category}
                </p>
                <p className="font-body text-base md:text-lg font-medium text-gold">
                  {product.price}
                </p>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </motion.div>

        {/* Botão Ver Todos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-12 md:mt-20"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-3 border border-gold/50 text-gold font-body text-xs md:text-sm uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:bg-gold hover:text-background transition-all duration-500 ease-lux hover:shadow-lux-hover"
          >
            Explorar Catálogo Completo
            <span className="group-hover:translate-x-1 transition-transform duration-500 text-base leading-none">→</span>
          </a>
        </motion.div>

        {/* Modal de Detalhes Cinematográfico */}
        <ProductModal 
          product={selectedProduct} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />

      </div>
    </section>
  );
};

export default memo(ProductGrid);