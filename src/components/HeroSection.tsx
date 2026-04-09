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
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <section ref={ref} className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-background">
      
      {/* Background Image com Efeito Zoom e Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={heroImage}
          alt="Soler Shop Luxury Perfume"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Conteúdo (Textos e Botão) */}
      <motion.div
        className="relative z-20 max-w-7xl mx-auto section-padding w-full py-16 md:py-24"
        style={{ y: textY, opacity }}
      >
        <motion.div
          className="max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4 md:mb-6">
            <span className="w-8 h-[1px] bg-gold block"></span>
            <p className="text-gold font-body text-xs md:text-sm uppercase tracking-[0.3em]">
              Santos / Ilhabela — Envio Nacional
            </p>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[1.05] mb-6 md:mb-8 tracking-tight"
          >
            Sua Dose Diária de <br />
            <span className="italic text-gold font-light">Luxo</span> e Cuidado
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-body text-muted-foreground text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-md font-light"
          >
            Trabalhamos com as marcas mais desejadas do mundo. Descubra perfumes, body splashes e esfoliantes 100% originais.
          </motion.p>

          <motion.a
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#products"
            className="group relative inline-flex items-center gap-4 bg-gold text-background px-8 py-4 uppercase tracking-[0.2em] font-medium text-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            Explorar Produtos
            <span className="text-lg leading-none font-light group-hover:translate-x-1 transition-transform">→</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;