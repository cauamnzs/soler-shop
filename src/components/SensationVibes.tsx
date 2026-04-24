import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef, memo } from "react";
import { vibes } from "@/data/mockData";
import { Vibe } from "@/types";

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

const VibeModule = ({ vibe, index }: { vibe: Vibe, index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  if (!vibe) return null;

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.96,
      z: -20
    },
    visible: {
      opacity: 1,
      scale: 1,
      z: 0,
      transition: { 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1] 
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      data-cursor-label="Sentir"
      style={IS_MOBILE ? {} : { 
        scale, 
        opacity, 
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)"
      }}
      className="relative w-[85vw] sm:w-[70vw] md:w-full aspect-square group overflow-hidden rounded-3xl border border-white/5 hover:border-gold/25 shadow-2xl bg-black/5 flex-shrink-0 snap-center md:snap-align-none transition-colors duration-700"
    >
      {/* Watermark number */}
      <span
        className="absolute top-6 right-7 font-heading font-bold leading-none select-none pointer-events-none z-20 text-white/[0.07] text-[5rem] lg:text-[7rem]"
        aria-hidden="true"
      >
        0{index + 1}
      </span>

      <motion.img
        src={vibe.image}
        alt={vibe.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      <div 
        className="absolute inset-0 backdrop-blur-[1px] mix-blend-overlay opacity-40 group-hover:opacity-65 pointer-events-none transition-opacity duration-700"
        style={{ backgroundColor: vibe.color }}
      />

      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-10 lg:p-16 translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-lux">
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-black/65 md:bg-black/40 md:backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl">
          <span className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold font-body text-[9px] uppercase tracking-[0.4em] px-3 py-1 rounded-full mb-5">
            Vibe 0{index + 1}
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-4 md:mb-6 leading-tight">
            {vibe.title.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "italic font-light text-gold" : ""}>
                {word}{' '}
              </span>
            ))}
          </h3>
          <p className="font-body text-white/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium tracking-wide max-w-2xl">
            {vibe.description}
          </p>
          <div className="flex items-center justify-between mt-6 md:mt-8">
            <div className="h-[1px] bg-gold/60 w-16 group-hover:w-24 transition-all duration-700" />
            <span className="font-body text-transparent group-hover:text-white/50 text-[10px] uppercase tracking-[0.3em] transition-colors duration-500">
              Explorar →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SensationVibes = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      },
    },
  };

  return (
    <section ref={containerRef} className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-background/50">
      {/* Fade superior suave - continuação do Hero */}
      <div className="absolute top-0 left-0 w-full h-40 md:h-56 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-0" />
      {/* Fade inferior suave - transição para ProductGrid */}
      <div className="absolute bottom-0 left-0 w-full h-40 md:h-56 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-0" />
      
      <div className="max-w-screen-2xl mx-auto relative z-10 pt-8 md:pt-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center mb-10 md:mb-16 px-4"
        >
          <motion.div variants={headerVariants} className="flex flex-col items-center gap-4 md:gap-6">
            <span className="text-gold font-body text-[10px] uppercase tracking-[0.8em]">Curadoria de Sensações</span>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground leading-[1.1] break-words">
              A Arte do <br className="lg:hidden" /> <span className="italic font-light text-gold">Sentir</span>
            </h2>
            <p className="text-muted-foreground font-body text-base md:text-lg lg:text-xl max-w-2xl font-light leading-relaxed">
              Uma galeria de experiências olfativas. Explore o luxo através das vibrações da natureza em um grid de pura simetria.
            </p>
          </motion.div>
        </motion.div>

        <div className="relative">
          <motion.div 
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex md:grid md:grid-cols-2 gap-8 lg:gap-12 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide pb-8 md:pb-0 px-4 sm:px-6 lg:px-12 xl:px-20"
          >
            {vibes.map((vibe, index) => (
              <VibeModule key={vibe.id} vibe={vibe} index={index} />
            ))}
          </motion.div>
          {/* Mobile scroll hint — fade gradient on the right */}
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background via-background/60 to-transparent pointer-events-none z-10 md:hidden" />
        </div>
      </div>
    </section>
  );
};

export default memo(SensationVibes);
