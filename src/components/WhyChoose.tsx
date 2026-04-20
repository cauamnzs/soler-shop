import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ShieldCheck, Sparkles, MapPin, Truck } from "lucide-react";

const highlights = [
  { 
    icon: ShieldCheck, 
    title: "100% Originais", 
    desc: "Cada fragrância em nosso catálogo passa por um rigoroso processo de autenticação. Trabalhamos apenas com lotes verificados das casas mais prestigiadas do mundo." 
  },
  { 
    icon: Sparkles, 
    title: "Curadoria Especial", 
    desc: "Nossa seleção não é baseada em tendências passageiras, mas em composições atemporais que definem presença e sofisticação." 
  },
  { 
    icon: MapPin, 
    title: "Herança Litorânea", 
    desc: "Nascidos entre o charme de Santos e a exclusividade de Ilhabela, trazemos a leveza do mar aliada ao luxo cosmopolita." 
  },
  { 
    icon: Truck, 
    title: "Logística White-Glove", 
    desc: "Sua encomenda é tratada como uma obra de arte. Embalagem reforçada e envio prioritário para garantir a integridade do frasco." 
  },
];

const FeatureCard = ({ item, index }: { item: typeof highlights[0], index: number }) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px", once: false });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 30 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)"
      }}
      className="min-h-[40vh] md:min-h-[50vh] flex flex-col justify-center py-12 md:py-20"
    >
      <div className={`w-12 h-12 mb-8 flex items-center justify-center transition-colors duration-700 ${isInView ? "text-gold" : "text-gold/30"}`}>
        <item.icon strokeWidth={1} size={32} />
      </div>
      
      <h3 className={`font-heading text-3xl md:text-5xl mb-6 transition-colors duration-700 ${isInView ? "text-foreground" : "text-muted-foreground/30"} tracking-tight`}>
        {item.title}
      </h3>
      
      <p className={`font-body text-base md:text-lg leading-relaxed font-light max-w-md transition-colors duration-700 ${isInView ? "text-muted-foreground/80" : "text-muted-foreground/20"}`}>
        {item.desc}
      </p>
      
      <motion.div 
        initial={{ width: 0 }} 
        animate={isInView ? { width: "60px" } : { width: 0 }} 
        className="h-[1px] bg-gold/30 mt-10" 
      />
    </motion.article>
  );
};

const WhyChoose = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative w-full py-16 md:py-24 lg:py-32 bg-background/50 overflow-visible">
      {/* Fade superior suave - continuação de ProductGrid */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-0" />
      {/* Fade inferior suave - transição para InstagramFeed */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-0" />
      
      <div className="max-w-screen-2xl mx-auto section-padding flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24 relative z-10">
        
        {/* Coluna 1 (Esquerda): Título Fixo (Sticky) - Editorial Minimalista */}
        <div className="w-full lg:w-1/2 md:h-[60vh] lg:sticky lg:top-[20vh] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="max-w-md lg:max-w-none"
          >
            <span className="text-gold/60 font-body text-[10px] uppercase tracking-[0.6em] mb-6 block whitespace-nowrap">The Soler Heritage</span>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground mb-8 leading-[1.1] break-words">
              A Experiência <br className="hidden lg:block" />
              <span className="italic font-light text-gold">Soler</span>
            </h2>
            <p className="font-body text-muted-foreground/70 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-lg lg:max-w-xl">
              Não vendemos apenas produtos; entregamos fragmentos de um estilo de vida onde o tempo é o maior luxo.
            </p>
          </motion.div>
        </div>

        {/* Coluna 2 (Direita): Scrolling Narrativo - Cards de Ícones */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {highlights.map((item, index) => (
            <FeatureCard key={item.title} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChoose;
