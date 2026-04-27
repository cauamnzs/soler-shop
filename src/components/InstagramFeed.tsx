import { motion, Variants } from "framer-motion";
import { Instagram } from "lucide-react";
import { useRef } from "react";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta6 from "@/assets/insta-6.jpg";

const photos = [insta1, insta2, insta3, insta4, insta5, insta6];

const InstagramFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animação do cabeçalho
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Cascata da grade de fotos
  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  // Animação individual de cada foto surgindo
  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="instagram" ref={containerRef} className="relative py-12 md:py-20 overflow-hidden bg-background/50">
      {/* Fade superior suave - continuação de WhyChoose */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-0" />
      {/* Fade inferior suave - transição para Footer escuro */}
      <div className="absolute bottom-0 left-0 w-full h-48 md:h-64 pointer-events-none z-0"
        style={{ background: "linear-gradient(to top, hsl(25,12%,13%) 0%, hsl(25,12%,13%,0.7) 35%, transparent 100%)" }}
      />
      
      <div className="max-w-7xl mx-auto section-padding relative z-10">
        
        {/* Cabeçalho */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="text-center mb-10 md:mb-16 flex flex-col items-center px-4"
        >
          <span className="text-gold/60 font-body text-[10px] uppercase tracking-[0.6em] mb-6 block">Social Curatorship</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 tracking-tight break-words">
            Da Comunidade <span className="italic text-gold font-light">Soler</span>
          </h2>
          <a
            href="https://instagram.com/solershop_"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-muted-foreground/60 font-body text-[10px] sm:text-xs hover:text-gold transition-colors duration-500 uppercase tracking-[0.3em] relative
              after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full
              after:h-[1px] after:bg-gold after:scale-x-0 after:origin-right
              after:transition-transform after:duration-500 after:ease-lux hover:after:scale-x-100 hover:after:origin-left"
          >
            <Instagram size={14} className="group-hover:scale-110 transition-transform duration-500" />
            Siga-nos @solershop_
          </a>
        </motion.div>

        {/* Stories mobile */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="md:hidden flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-3 -mx-1 px-1"
        >
          {photos.map((photo, i) => (
            <motion.a
              key={`mobile-${i}`}
              variants={itemVariants}
              href="https://instagram.com/solershop_"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { try { navigator.vibrate?.(6); } catch {} }}
              className="touch-cta snap-center shrink-0 w-[72vw] max-w-[290px] overflow-hidden rounded-2xl group relative block bg-gold/5 border border-white/10 active:scale-[0.98] transition-transform duration-75"
            >
              <div className="aspect-[3/4]">
                <img
                  src={photo}
                  alt={`Foto da comunidade Soler Shop ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-active:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Instagram size={11} className="text-white/60" strokeWidth={1.5} />
                  <span className="text-white/60 font-body text-[9px] tracking-[0.2em]">@solershop_</span>
                </div>
                <span className="text-white/40 font-body text-[8px] uppercase tracking-[0.28em]">
                  {String(i + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Grade de Fotos */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="hidden md:grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
        >
          {photos.map((photo, i) => (
            <motion.a
              key={i}
              variants={itemVariants}
              href="https://instagram.com/solershop_"
              target="_blank"
              rel="noopener noreferrer"
              className={`overflow-hidden rounded-xl group relative block bg-gold/5 border border-white/5 hover:border-gold/20 transition-colors duration-500 ${
                i === 0
                  ? "aspect-square sm:aspect-auto sm:col-span-2 sm:row-span-2"
                  : "aspect-square"
              }`}
            >
              <img
                src={photo}
                alt={`Foto da comunidade Soler Shop ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/0 group-hover:bg-black/30 transition-all duration-700 ease-out flex items-center justify-center group-hover:backdrop-blur-[1px]">
                <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <Instagram size={28} strokeWidth={1} className="text-white/80" />
                </div>
              </div>
              {/* Photo counter */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-white/50 font-body text-[9px] uppercase tracking-[0.3em]">
                  {String(i + 1).padStart(2, "0")}/{String(photos.length).padStart(2, "0")}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default InstagramFeed;