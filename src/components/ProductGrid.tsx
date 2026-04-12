import { motion, Variants } from "framer-motion";
import { Eye } from "lucide-react";
import { products } from "@/data/mockData";
import { useState, memo } from "react";
import { Product } from "@/types";
import ProductModal from "./ProductModal";

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <section id="products" className="py-24 md:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto section-padding">
        
        {/* Cabeçalho */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="flex flex-col items-center mb-16 md:mb-24"
        >
          <span className="w-8 h-[1px] bg-gold block mb-6"></span>
          <h2 className="font-heading text-4xl md:text-5xl text-center text-foreground mb-4">
            Nossos <span className="italic text-gold font-light">Favoritos</span>
          </h2>
          <p className="text-center text-muted-foreground font-body text-sm md:text-base uppercase tracking-[0.4em] font-light">
            Seleção exclusiva de importados
          </p>
        </motion.div>

        {/* Grade de Produtos */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16"
        >
          {products.map((product) => (
            <motion.div
              key={product.name}
              variants={itemVariants}
              data-cursor-label="Explorar"
              onClick={() => openModal(product)}
              style={{ 
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)"
              }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Box da Imagem */}
              <div className="relative aspect-square overflow-hidden bg-secondary/10 rounded-xl mb-5">
                <img
                  src={product.image}
                  alt={`Imagem do produto ${product.name}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] group-hover:scale-105"
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
          className="text-center mt-16 md:mt-24"
        >
          <a href="#" className="inline-block border-b border-gold text-gold font-body text-xs md:text-sm uppercase tracking-[0.2em] pb-1 hover:text-foreground hover:border-foreground transition-colors duration-300">
            Explorar Catálogo Completo
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