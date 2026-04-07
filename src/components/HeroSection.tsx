import heroImage from "@/assets/hero-perfume.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury perfume on marble"
          className="w-full h-full object-cover object-center"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto section-padding w-full py-16 md:py-24">
        <div className="max-w-xl animate-fade-up">
          <p className="text-gold-light font-body text-xs md:text-sm uppercase tracking-[0.3em] mb-4 md:mb-6">
            Santos / Ilhabela, Brasil — Envio para Todo o País
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-[1.1] mb-6 md:mb-8">
            Sua Dose Diária de{" "}
            <span className="italic text-gold-light">Luxo</span> e Cuidado
          </h1>
          <p className="font-body text-primary-foreground/80 text-sm md:text-base leading-relaxed mb-8 md:mb-10 max-w-md">
          Trabalhamos com as marcas mais desejadas do mundo. Descubra perfumes, body splashes e esfoliantes 100% originais.
          </p>
          <a href="#products" className="btn-gold inline-block text-sm md:text-base">
            EXPLORAR PRODUTOS
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
