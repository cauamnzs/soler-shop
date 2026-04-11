import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import catFragrances from "@/assets/cat-fragrances.jpg";
import catBodycare from "@/assets/cat-bodycare.jpg";
import catLips from "@/assets/cat-lips.jpg";

const categories = [
  { 
    title: "Perfumes Importados", 
    image: catFragrances, 
    alt: "Frasco de perfume importado com tampa dourada",
    layout: "large-vertical"
  },
  { 
    title: "Esfoliantes", 
    image: catBodycare, 
    alt: "Pote de esfoliante corporal da Tree Hut",
    layout: "small-horizontal"
  },
  { 
    title: "Kits Exclusivos", 
    image: catLips, 
    alt: "Kits exclusivos de beleza e cuidados",
    layout: "offset-vertical"
  },
];

const MagneticCard = ({ cat, variants }: { cat: typeof categories[0], variants: Variants }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  
  // Motion values para o efeito magnético
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calcula o deslocamento (limitado a 15px para elegância)
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Classes de layout assimétrico
  const layoutClasses = {
    "large-vertical": "col-span-1 md:col-span-2 row-span-2 aspect-[4/5] md:aspect-[3/4]",
    "small-horizontal": "col-span-1 md:col-span-1 aspect-[1/1] md:aspect-[4/3] md:translate-y-12",
    "offset-vertical": "col-span-1 md:col-span-1 aspect-[4/5] md:translate-x-[-10%] md:translate-y-[-20%]"
  };

  return (
    <motion.a
      ref={cardRef}
      href="#"
      variants={variants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className={`group cursor-pointer relative overflow-hidden bg-card shadow-lux hover:shadow-lux-hover transition-shadow duration-700 ease-lux ${layoutClasses[cat.layout as keyof typeof layoutClasses]}`}
    >
      <div className="w-full h-full overflow-hidden relative">
        <motion.img
          src={cat.image}
          alt={cat.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-lux" />
      </div>
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end items-start opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] translate-y-8 group-hover:translate-y-0">
        <h3 className="font-heading text-2xl md:text-4xl text-foreground mb-4 leading-tight">
          {cat.title.split(' ').map((word, i) => (
            <span key={i} className={i === 1 ? "italic font-light text-gold block" : "block"}>
              {word}
            </span>
          ))}
        </h3>
        
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-[10px] font-body uppercase tracking-[0.4em] text-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 delay-100 ease-lux">
            Descobrir Coleção
          </span>
          <span className="text-gold font-light translate-x-[-200%] group-hover:translate-x-0 transition-transform duration-700 delay-150 ease-lux">→</span>
        </div>
      </div>
    </motion.a>
  );
};

const CategoryCards = () => {
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.23, 1, 0.32, 1] },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <section className="max-w-7xl mx-auto section-padding py-24 md:py-48 overflow-visible">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-start mb-20 md:mb-32 max-w-2xl"
      >
        <motion.div variants={headerVariants} className="flex items-center gap-4 mb-6">
          <span className="w-12 h-[1px] bg-gold"></span>
          <span className="text-gold font-body text-xs uppercase tracking-[0.5em]">Curadoria Editorial</span>
        </motion.div>
        <motion.h2 variants={headerVariants} className="font-heading text-5xl md:text-7xl text-foreground mb-8 leading-[1.1]">
          A Arte da <span className="italic font-light text-gold">Seleção</span>
        </motion.h2>
        <motion.p variants={headerVariants} className="text-muted-foreground font-body text-lg leading-relaxed font-light">
          Exploramos o mundo para trazer apenas o que há de mais extraordinário em fragrâncias e cuidados.
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-24 items-start"
      >
        {categories.map((cat) => (
          <MagneticCard key={cat.title} cat={cat} variants={cardVariants} />
        ))}
      </motion.div>
    </section>
  );
};

export default CategoryCards;
