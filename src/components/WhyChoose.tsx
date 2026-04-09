import { motion, Variants } from "framer-motion";
import { ShieldCheck, Sparkles, MapPin, Truck } from "lucide-react";

const highlights = [
  { icon: ShieldCheck, title: "100% Originais", desc: "Todos os produtos são importados autênticos com origem verificada" },
  { icon: Sparkles, title: "Curadoria Especial", desc: "Cada item é selecionado pessoalmente por qualidade e elegância" },
  { icon: MapPin, title: "Santos & Ilhabela", desc: "Nascidos no litoral de São Paulo, inspirados pelo sol e mar" },
  { icon: Truck, title: "Envio Rápido", desc: "Entrega confiável e segura para todo o território nacional" },
];

const WhyChoose = () => {
  // Animação do cabeçalho
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  // Cascata para os diferenciais
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  // Animação de cada ícone (surgindo e crescendo levemente)
  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Linha decorativa de fundo (opcional, dá um charme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent to-gold/20" />

      <div className="max-w-7xl mx-auto section-padding relative z-10">
        
        {/* Cabeçalho */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="flex flex-col items-center mb-16 md:mb-24"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-center text-foreground mb-4 tracking-tight">
            A Experiência <span className="italic text-gold font-light">Soler</span>
          </h2>
          <p className="text-center text-muted-foreground font-body text-sm md:text-base uppercase tracking-[0.2em] max-w-lg mx-auto font-light">
            Mais do que uma loja, um estilo de vida
          </p>
        </motion.div>

        {/* Grade de Diferenciais */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12"
        >
          {highlights.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="flex flex-col items-center text-center group cursor-default"
            >
              {/* Ícone com borda animada */}
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-full border border-foreground/10 bg-transparent
                transition-all duration-500 ease-out group-hover:border-gold/50 group-hover:bg-gold/5"
              >
                {/* Brilho interno sutil no hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-opacity duration-500" />
                <item.icon
                  strokeWidth={1.5}
                  size={32}
                  className="text-muted-foreground group-hover:text-gold transition-colors duration-500 relative z-10"
                />
              </div>

              {/* Textos */}
              <h3 className="font-heading text-lg md:text-xl text-foreground mb-3 transition-colors duration-300 group-hover:text-gold">
                {item.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground font-light leading-relaxed max-w-[250px]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChoose;