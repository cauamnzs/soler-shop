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
      transition={{ duration: 1, ease: [0.2, 0.65, 0.3, 0.9] }}
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
    <section ref={containerRef} className="relative w-full py-24 md:py-32 bg-transparent overflow-visible">
      {/* Seamless Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent backdrop-blur-[1px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto section-padding flex flex-col md:flex-row gap-16 md:gap-24 relative z-10">
        
        {/* Título Fixo (Sticky) - Editorial Minimalista */}
        <div className="w-full md:w-1/2 md:h-[70vh] md:sticky md:top-[15vh] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="max-w-md"
          >
            <span className="text-gold/60 font-body text-[10px] uppercase tracking-[0.6em] mb-6 block">The Soler Heritage</span>
            <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl text-foreground mb-8 leading-[1.1]">
              A Experiência <br />
              <span className="italic font-light text-gold">Soler</span>
            </h2>
            <p className="font-body text-muted-foreground/70 text-base md:text-lg font-light leading-relaxed">
              Não vendemos apenas produtos; entregamos fragmentos de um estilo de vida onde o tempo é o maior luxo.
            </p>
          </motion.div>
        </div>

        {/* Scrolling Narrativo - Limpo */}
        <div className="w-full md:w-1/2 flex flex-col">
          {highlights.map((item, index) => (
            <FeatureCard key={item.title} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChoose;
