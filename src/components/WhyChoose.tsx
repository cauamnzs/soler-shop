import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Sparkles, MapPin, Truck } from "lucide-react";

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

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

const FeatureCard = ({ item, index }: { item: typeof highlights[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={IS_MOBILE ? {} : { willChange: "transform, opacity" }}
      className="relative p-5 sm:p-8 lg:p-10 rounded-2xl border border-border/50 md:border-border/30 group hover:border-gold/30 bg-background/20 backdrop-blur-sm transition-all duration-500 hover:bg-gold/[0.025] overflow-hidden cursor-default"
    >
      {/* Shimmer sweep on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1100ms] ease-lux pointer-events-none" />

      {/* Watermark number */}
      <span
        className="absolute -top-3 right-5 font-heading font-bold leading-none select-none pointer-events-none text-[6.5rem] lg:text-[8rem] text-foreground/[0.035]"
        aria-hidden="true"
      >
        0{index + 1}
      </span>

      {/* Icon */}
      <div className="w-11 h-11 mb-5 md:mb-7 flex items-center justify-center text-gold group-hover:scale-110 group-hover:drop-shadow-[0_0_14px_rgba(212,175,55,0.55)] transition-all duration-500">
        <item.icon strokeWidth={1} size={28} />
      </div>

      {/* Content */}
      <h3 className="font-heading text-xl md:text-2xl lg:text-3xl text-foreground mb-4 tracking-tight">
        {item.title}
      </h3>
      <p className="font-body text-muted-foreground/80 md:text-muted-foreground/70 text-sm md:text-base leading-relaxed font-light line-clamp-4 md:line-clamp-none">
        {item.desc}
      </p>

      {/* Accent line */}
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 48 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="h-[1px] bg-gold/40 mt-8"
      />
    </motion.div>
  );
};

const WhyChoose = () => {
  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 bg-background/50 overflow-hidden">
      {/* Fade superior */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-0" />
      {/* Fade inferior */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-0" />

      <div className="max-w-screen-xl mx-auto section-padding relative z-10">

        {/* Section Header — centralizado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 md:mb-20"
        >
          <span className="text-gold/60 font-body text-[10px] uppercase tracking-[0.6em] mb-6 block">
            The Soler Heritage
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-[1.1] break-words">
            A Experiência <span className="italic font-light text-gold">Soler</span>
          </h2>
          <p className="font-body text-muted-foreground/80 md:text-muted-foreground/70 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
            Não vendemos apenas produtos; entregamos fragmentos de um estilo de vida onde o tempo é o maior luxo.
          </p>
        </motion.div>

        {/* Feature Cards — 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {highlights.map((item, index) => (
            <FeatureCard key={item.title} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChoose;
