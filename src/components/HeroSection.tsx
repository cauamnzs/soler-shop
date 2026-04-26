import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, Variants } from "framer-motion";
import heroImage from "@/assets/hero-perfume.jpg";

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

const CountUp = ({ end, suffix, duration = 1300 }: { end: number; suffix: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(end);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

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
    <section ref={ref} className="relative w-full min-h-[72dvh] md:min-h-[75vh] flex items-center overflow-hidden bg-transparent z-10">
      
      {/* Background Image com Efeito Zoom e Parallax */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ 
          y: IS_MOBILE ? "0%" : backgroundY,
          maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)"
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

      <div className="relative z-20 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-8 lg:gap-12 pt-14 pb-8 md:py-16 lg:py-24">
        <motion.div
          className="w-full md:w-3/5 lg:w-1/2 mt-8 md:mt-0"
          style={IS_MOBILE ? {} : { 
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
          <motion.div variants={itemVariants} className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <span className="w-8 h-[1px] bg-gold block"></span>
            <p className="text-gold font-body text-[9px] md:text-xs lg:text-sm uppercase tracking-[0.28em] md:tracking-[0.4em] whitespace-nowrap">
              Santos / Ilhabela — Envio Nacional
            </p>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-heading text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground leading-[1.08] md:leading-[1.05] mb-5 md:mb-8 break-words"
          >
            Sua Dose Diária de <br className="hidden sm:block" />
            <span className="italic font-light text-gold">Luxo</span>
            <span className="inline sm:hidden"> &amp; Cuidado</span>
            <span className="hidden sm:inline"> e Cuidado</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-body text-muted-foreground text-[13px] md:text-base lg:text-lg leading-relaxed mb-7 md:mb-10 max-w-md font-light line-clamp-2 md:line-clamp-none"
          >
            Trabalhamos com as marcas mais desejadas do mundo. Descubra perfumes, body splashes e esfoliantes 100% originais.
          </motion.p>

          <motion.a
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            href="#products"
            data-cursor-label="Explorar"
            className="group relative overflow-hidden inline-flex items-center justify-center w-full sm:w-auto gap-4 bg-gold text-background px-8 py-4.5 md:py-4 uppercase tracking-[0.2em] font-medium text-[11px] md:text-sm transition-lux duration-500 shadow-lux hover:shadow-lux-hover"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-lux pointer-events-none" />
            Explorar Produtos
            <span className="text-lg leading-none font-light group-hover:translate-x-1 transition-transform duration-500 ease-lux">→</span>
          </motion.a>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-5 md:gap-8 pt-5 mt-4 border-t border-border/20"
          >
            {[
              { end: 500, suffix: "+", label: "Produtos" },
              { end: 100, suffix: "%", label: "Originais" },
              { end: 4, suffix: " anos", label: "Experiência" },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col ${i === 2 ? "hidden sm:flex" : ""}`}>
                <span className="font-heading text-xl md:text-2xl text-foreground font-semibold leading-none mb-1">
                  <CountUp end={stat.end} suffix={stat.suffix} duration={1300} />
                </span>
                <span className="font-body text-[9px] uppercase tracking-[0.25em] text-muted-foreground/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="hidden md:block w-full md:w-2/5 lg:w-1/2 h-[40vh] lg:h-[60vh] relative z-30"
          style={{ y: imageOverlapY, willChange: "transform" }}
        >
          <div className="absolute inset-0 bg-gold/5 backdrop-blur-[2px] rounded-xl border border-white/10 group-hover:border-gold/30 shadow-2xl overflow-hidden group transition-colors duration-700">
            <img 
              src={heroImage} 
              alt="Frasco de perfume detalhe" 
              className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-700">
              <span className="text-white/50 font-body text-[9px] uppercase tracking-[0.5em]">Premium Collection — Soler Shop</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Indicador de Scroll */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 1 }}
      >
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-gold/50 to-transparent"
          animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>

      {/* Fade inferior suave para transição contínua */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-20" />
    </section>
  );
};

export default HeroSection;