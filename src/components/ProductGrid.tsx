import { motion, Variants } from "framer-motion";
import { Eye } from "lucide-react";
import { useState, memo } from "react";
import { Product } from "@/types";
import ProductModal from "./ProductModal";
import { useProducts } from "@/hooks/useProducts";

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: products = [], isLoading, isError } = useProducts();

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
          <span className="w-8 h-[1px] bg-gold block mb-6"></span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center text-foreground mb-4 break-words">
            Nossos <span className="italic text-gold font-light">Favoritos</span>
          </h2>
          <p className="text-center text-muted-foreground font-body text-xs sm:text-sm md:text-base uppercase tracking-[0.4em] font-light max-w-lg">
            Seleção exclusiva de importados
          </p>
        </motion.div>

        {/* Grade de Produtos */}
        {isLoading && (
          <div className="text-center mb-10 md:mb-14">
            <p className="text-muted-foreground font-body text-xs sm:text-sm md:text-base uppercase tracking-[0.3em]">
              Carregando catálogo...
            </p>
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
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              data-cursor-label="Explorar"
              onClick={() => openModal(product)}
              style={{ 
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)"
              }}
              className="group cursor-pointer flex flex-col transition-transform duration-500 ease-out hover:-translate-y-1"
            >
              {/* Box da Imagem */}
              <div className="relative aspect-square overflow-hidden bg-secondary/10 rounded-xl mb-5 shadow-sm group-hover:shadow-lg transition-shadow duration-500">
                <img
                  src={product.image}
                  alt={`Imagem do produto ${product.name}`}
                  width="600"
                  height="600"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] group-hover:scale-105"
                />
                
                {/* Tag de Destaque */}
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground text-[10px] font-body font-medium uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-foreground/5">
                    {product.tag}
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
                <h3 className="font-body text-sm md:text-base font-light text-muted-foreground leading-snug mb-2 transition-colors duration-300 group-hover:text-foreground">
                  {product.name}
                </h3>
                <p className="font-body text-base md:text-lg font-medium text-foreground group-hover:text-gold transition-colors duration-300">
                  {product.price}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Botão Ver Todos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-12 md:mt-20"
        >
          <div className="group">
            <a href="#" className="inline-block border-b border-gold text-gold font-body text-xs md:text-sm uppercase tracking-[0.2em] pb-1 hover:text-foreground hover:border-foreground transition-colors duration-300 relative
              after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full
              after:h-[1px] after:bg-gold after:scale-x-0 after:origin-right
              after:transition-transform after:duration-500 after:ease-lux hover:after:scale-x-100 hover:after:origin-left">
              Explorar Catálogo Completo
            </a>
          </div>
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