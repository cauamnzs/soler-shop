import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef, memo } from "react";
import vibe1 from "@/assets/cat-fragrances.jpg";
import vibe2 from "@/assets/cat-bodycare.jpg";
import vibe3 from "@/assets/cat-lips.jpg";
import vibe4 from "@/assets/hero-perfume.jpg"; // Usando a imagem do hero para a 4ª vibe clássica

const vibes = [
  {
    id: "vibe-1",
    title: "Ocaso Romântico",
    description: "Dourado Quente e Âmbar. Uma fragrância que captura o último raio de sol.",
    image: vibe1,
    color: "rgba(212, 175, 55, 0.15)",
  },
  {
    id: "vibe-2",
    title: "Amanhecer Fresco",
    description: "Cítrico e Off-White. A pureza do orvalho matinal em um frasco de cristal.",
    image: vibe2,
    color: "rgba(250, 249, 246, 0.15)",
  },
  {
    id: "vibe-3",
    title: "Mistério Noturno",
    description: "Amadeirado e Prata. O enigma das noites cosmopolitas revelado.",
    image: vibe3,
    color: "rgba(0, 0, 0, 0.2)",
  },
  {
    id: "vibe-4",
    title: "Aura Clássica",
    description: "Neutro e Dourado suave. A quintessência da elegância atemporal.",
    image: vibe4,
    color: "rgba(212, 175, 55, 0.1)",
  }
];

const VibeModule = ({ vibe, index }: { vibe: typeof vibes[0], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Garantir que os hooks de scroll e transform estão sendo chamados no topo do sub-componente
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Fallback para caso os dados estejam ausentes (mesmo sendo constantes)
  if (!vibe) return null;

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, willChange: "transform, opacity" }}
      className="relative w-full aspect-[4/5] md:aspect-[1/1] group overflow-hidden rounded-sm border border-white/5 shadow-2xl bg-black/5"
    >
      {/* Imagem de Fundo com Zoom sutil no Hover */}
      <motion.img
        src={vibe.image}
        alt={vibe.title}
        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
      />
      
      {/* Overlay de Gradiente e Cor da Vibe */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      <div 
        className="absolute inset-0 backdrop-blur-[1px] mix-blend-overlay opacity-40 pointer-events-none"
        style={{ backgroundColor: vibe.color }}
      />

      {/* Painel de Vidro com Legenda (Posicionamento Padronizado: Inferior Esquerdo) */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-lux">
        <div className="p-6 md:p-8 bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-sm">
          <span className="text-gold font-body text-[10px] uppercase tracking-[0.6em] mb-3 block opacity-80">
            Vibe 0{index + 1}
          </span>
          <h3 className="font-heading text-2xl md:text-4xl text-white mb-4 leading-tight">
            {vibe.title.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "italic font-light text-gold" : ""}>
                {word}{' '}
              </span>
            ))}
          </h3>
          <p className="font-body text-white/90 text-sm md:text-base leading-relaxed font-medium tracking-wide">
            {vibe.description}
          </p>
          <div className="w-10 h-[1px] bg-gold/60 mt-6 group-hover:w-20 transition-all duration-700" />
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
      transition: { duration: 1.2, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <section ref={containerRef} className="relative w-full py-24 md:py-48 overflow-hidden bg-transparent">
      {/* Gradiente de Integração */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-background to-transparent pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto section-padding relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center mb-20 md:mb-32"
        >
          <motion.div variants={headerVariants} className="flex flex-col items-center gap-6">
            <span className="text-gold font-body text-[10px] uppercase tracking-[0.8em]">Curadoria de Sensações</span>
            <h2 className="font-heading text-5xl md:text-8xl text-foreground leading-[1.1]">
              A Arte do <span className="italic font-light text-gold">Sentir</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg md:text-xl max-w-2xl font-light leading-relaxed">
              Uma galeria de experiências olfativas. Explore o luxo através das vibrações da natureza em um grid de pura simetria.
            </p>
          </motion.div>
        </motion.div>

        {/* Grid Simétrico 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {vibes.map((vibe, index) => (
            <VibeModule key={vibe.id} vibe={vibe} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(SensationVibes);
