import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ShieldCheck, Sparkles, MapPin, Truck } from "lucide-react";
import { triggerShockwave } from "./FluidBackground";

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
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (isInView) {
      triggerShockwave(0.5 + index * 0.1);
    }
  }, [isInView, index]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0.2, x: 20 }}
      animate={{ 
        opacity: isInView ? 1 : 0.2, 
        x: isInView ? 0 : 20,
        scale: isInView ? 1 : 0.95
      }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="min-h-[60vh] flex flex-col justify-center py-12"
    >
      <div className={`w-16 h-16 mb-8 flex items-center justify-center rounded-full border transition-colors duration-700 ${isInView ? "border-gold bg-gold/5 text-gold" : "border-foreground/10 text-muted-foreground"}`}>
        <item.icon strokeWidth={1} size={32} />
      </div>
      
      <h3 className={`font-heading text-3xl md:text-5xl mb-6 transition-colors duration-700 ${isInView ? "text-foreground" : "text-muted-foreground/40"}`}>
        {item.title}
      </h3>
      
      <p className={`font-body text-lg md:text-xl leading-relaxed font-light max-w-md transition-colors duration-700 ${isInView ? "text-muted-foreground" : "text-muted-foreground/20"}`}>
        {item.desc}
      </p>
      
      {isInView && (
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: "100px" }} 
          className="h-[1px] bg-gold mt-8" 
        />
      )}
    </motion.article>
  );
};

const WhyChoose = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative w-full py-24 md:py-48">
      <div className="max-w-7xl mx-auto section-padding flex flex-col md:flex-row gap-12 md:gap-24">
        
        {/* Título Fixo (Sticky) */}
        <div className="w-full md:w-1/2 md:h-screen md:sticky md:top-0 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md"
          >
            <span className="text-gold font-body text-xs uppercase tracking-[0.5em] mb-6 block">The Soler Heritage</span>
            <h2 className="font-heading text-5xl md:text-8xl text-foreground mb-8 leading-tight">
              A Experiência <br />
              <span className="italic font-light text-gold">Soler</span>
            </h2>
            <div className="w-24 h-[1px] bg-gold mb-8"></div>
            <p className="font-body text-muted-foreground text-lg font-light leading-relaxed">
              Não vendemos apenas produtos; entregamos fragmentos de um estilo de vida onde o tempo é o maior luxo.
            </p>
          </motion.div>
        </div>

        {/* Scrolling Narrativo */}
        <div className="w-full md:w-1/2">
          {highlights.map((item, index) => (
            <FeatureCard key={item.title} item={item} index={index} />
          ))}
        </div>

      </div>
      
      {/* Background Decor (Opcional - Linha vertical de progresso) */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/10 to-transparent hidden lg:block" />
    </section>
  );
};

export default WhyChoose;
