import { motion, Variants } from "framer-motion";
import { Instagram } from "lucide-react";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta6 from "@/assets/insta-6.jpg";

const photos = [insta1, insta2, insta3, insta4, insta5, insta6];

const InstagramFeed = () => {
  // Animação do cabeçalho
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  // Cascata da grade de fotos
  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // Animação individual de cada foto surgindo
  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <section className="bg-secondary/20 py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto section-padding">
        
        {/* Cabeçalho */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="text-center mb-12 md:mb-20 flex flex-col items-center"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 tracking-tight">
            Da Comunidade <span className="italic text-gold font-light">Soler</span>
          </h2>
          <a
            href="https://instagram.com/solershop_"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-muted-foreground font-body text-xs md:text-sm hover:text-gold transition-colors duration-300 uppercase tracking-[0.2em]"
          >
            <Instagram size={16} className="group-hover:scale-110 transition-transform duration-300" />
            Siga-nos @solershop_
          </a>
        </motion.div>

        {/* Grade de Fotos */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4"
        >
          {photos.map((photo, i) => (
            <motion.a
              key={i}
              variants={itemVariants}
              href="https://instagram.com/solershop_"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square overflow-hidden rounded-sm group relative block bg-background"
            >
              <img
                src={photo}
                alt={`Foto da comunidade Soler Shop ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] group-hover:scale-110"
              />
              
              {/* Máscara Preta e Ícone no Hover */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-500 ease-out flex items-center justify-center">
                <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75">
                  <Instagram
                    size={36}
                    strokeWidth={1.2}
                    className="text-background"
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