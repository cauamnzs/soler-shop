import { motion, Variants } from "framer-motion";
import catFragrances from "@/assets/cat-fragrances.jpg";
import catBodycare from "@/assets/cat-bodycare.jpg";
import catLips from "@/assets/cat-lips.jpg";

const categories = [
  { 
    title: "Perfumes Importados", 
    image: catFragrances, 
    alt: "Frasco de perfume importado com tampa dourada" 
  },
  { 
    title: "Esfoliantes", 
    image: catBodycare, 
    alt: "Pote de esfoliante corporal da Tree Hut" 
  },
  { 
    title: "Kits Exclusivos", 
    image: catLips, 
    alt: "Kits exclusivos de beleza e cuidados" 
  },
];

const CategoryCards = () => {
  // Animação para o título e subtítulo
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  // Animação em cascata para os cards (um após o outro)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  // Animação individual de cada card vindo de baixo
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <section className="max-w-7xl mx-auto section-padding py-16 md:py-32">
      
      {/* Cabeçalho da Seção com Scroll Reveal */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center mb-12 md:mb-20"
      >
        <motion.h2 variants={headerVariants} className="font-heading text-4xl md:text-5xl text-center text-foreground mb-4 tracking-tight">
          Compre por <span className="italic text-gold font-light">Categoria</span>
        </motion.h2>
        <motion.p variants={headerVariants} className="text-center text-muted-foreground font-body text-sm md:text-base uppercase tracking-[0.2em]">
          Explore nossas coleções exclusivas
        </motion.p>
      </motion.div>

      {/* Grid de Cards com Scroll Reveal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {categories.map((cat) => (
          <motion.a
            key={cat.title}
            href="#"
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="group cursor-pointer relative overflow-hidden bg-card"
          >
            {/* Foto e Máscara */}
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={cat.image}
                alt={cat.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] group-hover:scale-110"
              />
              {/* Degradê preto embaixo para o texto brilhar */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
            </div>
            
            {/* Texto Flutuante por cima da foto */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <h3 className="font-heading text-2xl md:text-3xl text-primary-foreground group-hover:text-gold transition-colors duration-300 drop-shadow-lg">
                {cat.title}
              </h3>
              
              {/* Botão de explorar que surge no hover */}
              <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <span className="text-xs font-body uppercase tracking-[0.2em] text-gold">
                  Explorar
                </span>
                <span className="text-gold font-light">→</span>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>

    </section>
  );
};

export default CategoryCards;