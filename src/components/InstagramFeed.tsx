import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { Instagram } from "lucide-react";
import { useRef, useEffect } from "react";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta6 from "@/assets/insta-6.jpg";

const photos = [insta1, insta2, insta3, insta4, insta5, insta6];

const InstagramFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // O feed agora flui organicamente sem disparos de shockwave (foco em Ambient Noise)
  useEffect(() => {
    // Scroll progress disponível para futuras animações de scroll síncronas
  }, [scrollYProgress]);

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
    <section ref={containerRef} className="relative py-16 md:py-24 overflow-hidden bg-transparent">
      {/* Seamless Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.01] to-transparent backdrop-blur-[1px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto section-padding relative z-10">
        
        {/* Cabeçalho */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="text-center mb-12 md:mb-20 flex flex-col items-center"
        >
          <span className="text-gold/60 font-body text-[10px] uppercase tracking-[0.6em] mb-6 block">Social Curatorship</span>
          <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-6 tracking-tight">
            Da Comunidade <span className="italic text-gold font-light">Soler</span>
          </h2>
          <a
            href="https://instagram.com/solershop_"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-muted-foreground/60 font-body text-xs hover:text-gold transition-colors duration-500 uppercase tracking-[0.3em]"
          >
            <Instagram size={14} className="group-hover:scale-110 transition-transform duration-500" />
            Siga-nos @solershop_
          </a>
        </motion.div>

        {/* Grade de Fotos */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {photos.map((photo, i) => (
            <motion.a
              key={i}
              variants={itemVariants}
              style={{ 
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)"
              }}
              href="https://instagram.com/solershop_"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square overflow-hidden rounded-xl group relative block bg-gold/5 border border-white/5"
            >
              <img
                src={photo}
                alt={`Foto da comunidade Soler Shop ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
              />
              
              {/* Máscara e Ícone no Hover */}
              <div className="absolute inset-0 bg-background/0 group-hover:bg-gold/10 transition-all duration-700 ease-out flex items-center justify-center backdrop-blur-0 group-hover:backdrop-blur-[2px]">
                <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                  <Instagram
                    size={32}
                    strokeWidth={1}
                    className="text-white"
                  />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default InstagramFeed;