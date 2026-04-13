import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import heroImage from "@/assets/hero-perfume.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Hook do Framer Motion para capturar o scroll da página
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Criando o efeito Parallax (fundo e texto movem em velocidades diferentes)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const imageOverlapY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Regras de animação em Cascata (Stagger)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section ref={ref} className="relative w-full min-h-[85dvh] md:min-h-[75vh] flex items-center overflow-visible bg-transparent mb-[-2vh] md:mb-[-5vh] z-10">
      
      {/* Background Image com Efeito Zoom e Parallax */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ 
          y: backgroundY, 
          willChange: "transform",
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-background/90 via-background/80 to-transparent z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={heroImage}
          alt="Frasco de perfume de luxo Soler Shop com iluminação cinematográfica"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      <div className="relative z-20 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-8 lg:gap-12 py-8 md:py-16 lg:py-24">
        <motion.div
          className="w-full md:w-3/5 lg:w-1/2 mt-8 md:mt-0"
          style={{ 
            y: textY, 
            opacity, 
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)"
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4 md:mb-6">
            <span className="w-8 h-[1px] bg-gold block"></span>
            <p className="text-gold font-body text-[10px] md:text-xs lg:text-sm uppercase tracking-[0.4em] whitespace-nowrap">
              Santos / Ilhabela — Envio Nacional
            </p>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground leading-[1.1] md:leading-[1.05] mb-6 md:mb-8 break-words"
          >
            Sua Dose Diária de <br className="hidden sm:block" />
            <span className="italic font-light text-gold">Luxo</span> e Cuidado
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-body text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed mb-8 md:mb-10 max-w-md font-light"
          >
            Trabalhamos com as marcas mais desejadas do mundo. Descubra perfumes, body splashes e esfoliantes 100% originais.
          </motion.p>

          <motion.a
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            href="#products"
            data-cursor-label="Explorar"
            className="group relative inline-flex items-center justify-center w-full sm:w-auto gap-4 bg-gold text-background px-8 py-5 md:py-4 uppercase tracking-[0.2em] font-medium text-xs md:text-sm transition-lux duration-500 shadow-lux hover:shadow-lux-hover"
          >
            Explorar Produtos
            <span className="text-lg leading-none font-light group-hover:translate-x-1 transition-transform duration-500 ease-lux">→</span>
          </motion.a>
        </motion.div>

        <motion.div 
          className="hidden md:block w-full md:w-2/5 lg:w-1/2 h-[40vh] lg:h-[60vh] relative z-30"
          style={{ y: imageOverlapY, willChange: "transform" }}
        >
          <div className="absolute inset-0 bg-gold/5 backdrop-blur-[2px] rounded-xl border border-white/10 shadow-2xl overflow-hidden group">
            <img 
              src={heroImage} 
              alt="Frasco de perfume detalhe" 
              className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;