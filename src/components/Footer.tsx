import { motion, Variants } from "framer-motion";
import { Instagram, Mail, CreditCard, MessageCircle, ArrowRight } from "lucide-react";
import solerLogo from "@/assets/soler-logo.png";

const Footer = () => {
  // Cascata para as colunas do rodapé
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  // Animação individual de cada coluna surgindo
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <footer className="bg-foreground text-primary-foreground overflow-hidden relative z-50">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="max-w-7xl mx-auto section-padding py-10 md:py-16 pb-32 md:pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16"
        >
          {/* Marca / Sobre */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <a href="/" data-cursor-label="Início" className="touch-cta flex items-center gap-3 mb-5 inline-block active:opacity-80">
              <img src={solerLogo} alt="Soler Shop" className="h-10 w-10 md:h-12 md:w-12 brightness-0 invert opacity-90" />
              <span className="font-heading text-xl md:text-2xl tracking-wide text-primary-foreground">
                Soler <span className="italic font-light">Shop</span>
              </span>
            </a>

            <p className="font-body text-xs md:text-sm text-primary-foreground/65 md:text-primary-foreground/50 leading-relaxed font-light break-words max-w-xs">
              Produtos importados premium cuidadosamente selecionados. Trazendo exclusividade e luxo para a sua rotina diária.
            </p>
          </motion.div>

          {/* Navegação */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-sm uppercase tracking-[0.3em] mb-6 text-primary-foreground/90">
              Navegação
            </h4>
            <div className="flex flex-col space-y-3">
              {[
                { label: "Catálogo", href: "#products" },
                { label: "Perfumes", href: "?filter=Perfumes#products" },
                { label: "Body Splash", href: "?filter=Body%20Splash#products" },
                { label: "Instagram", href: "#instagram" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  data-cursor-label="Explorar"
                  className="touch-cta font-body text-sm text-primary-foreground/65 md:text-primary-foreground/50 font-light w-fit transition-lux duration-500 hover:text-gold hover:translate-x-1 active:text-gold"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Redes Sociais */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-sm uppercase tracking-[0.3em] mb-6 text-primary-foreground/90">
              Conecte-se
            </h4>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://instagram.com/solershop_"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Instagram"
                className="touch-cta w-11 h-11 rounded-full border border-primary-foreground/20 md:border-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 md:text-primary-foreground/50 hover:border-gold hover:text-gold hover:bg-gold/5 transition-lux duration-500 ease-lux active:scale-95"
                aria-label="Instagram"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/5513991234567"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="WhatsApp"
                className="touch-cta w-11 h-11 rounded-full border border-primary-foreground/20 md:border-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 md:text-primary-foreground/50 hover:border-gold hover:text-gold hover:bg-gold/5 transition-lux duration-500 ease-lux active:scale-95"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} strokeWidth={1.5} />
              </a>
              <a
                href="mailto:contato@solershop.com.br"
                data-cursor-label="Email"
                className="touch-cta w-11 h-11 rounded-full border border-primary-foreground/20 md:border-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 md:text-primary-foreground/50 hover:border-gold hover:text-gold hover:bg-gold/5 transition-lux duration-500 ease-lux active:scale-95"
                aria-label="Email"
              >
                <Mail size={20} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-sm uppercase tracking-[0.3em] mb-6 text-primary-foreground/90">
              The Soler Club
            </h4>
            <p className="font-body text-sm text-primary-foreground/65 md:text-primary-foreground/50 mb-5 font-light">
              Acesso antecipado a novidades e ofertas exclusivas.
            </p>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Seu endereço de e-mail"
                className="w-full bg-transparent border-b border-primary-foreground/30 md:border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/45 md:placeholder:text-primary-foreground/30 font-body text-sm px-2 py-3 pr-10 focus:outline-none focus:border-gold transition-all duration-500"
              />
              <button
                type="submit"
                aria-label="Assinar newsletter"
                className="touch-cta absolute right-0 bottom-2 w-8 h-8 flex items-center justify-center rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-background hover:border-gold transition-all duration-300 ease-lux active:scale-95"
              >
                <ArrowRight size={12} strokeWidth={2} />
              </button>
            </form>
          </motion.div>
        </motion.div>

        {/* Linha de Baixo (Bottom Bar) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="border-t border-primary-foreground/20 md:border-primary-foreground/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3 text-primary-foreground/45 md:text-primary-foreground/30">
            <CreditCard size={24} strokeWidth={1} />
            <span className="font-body text-[11px] tracking-wider uppercase text-center sm:text-left">
              Pix • Visa • Mastercard
            </span>
          </div>

          <p className="font-body text-xs text-primary-foreground/45 md:text-primary-foreground/30 tracking-wider font-light text-center md:text-right">
            2026 SOLER SHOP. TODOS OS DIREITOS RESERVADOS.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;