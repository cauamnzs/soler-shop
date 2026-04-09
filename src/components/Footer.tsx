import { motion, Variants } from "framer-motion";
import { Instagram, Facebook, Mail, CreditCard } from "lucide-react";
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
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <footer className="bg-foreground text-primary-foreground overflow-hidden relative z-50">
      <div className="max-w-7xl mx-auto section-padding py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16"
        >
          {/* Marca / Sobre */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <a href="/" className="flex items-center gap-3 mb-6 inline-block">
              <img src={solerLogo} alt="Soler Shop" className="h-12 w-12 brightness-0 invert opacity-90" />
              <span className="font-heading text-2xl tracking-wide text-primary-foreground">
                Soler <span className="italic font-light">Shop</span>
              </span>
            </a>
            <p className="font-body text-sm text-primary-foreground/50 leading-relaxed font-light">
              Produtos importados premium cuidadosamente selecionados. Trazendo exclusividade e luxo para a sua rotina diária.
            </p>
          </motion.div>

          {/* Navegação */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-sm uppercase tracking-[0.2em] mb-6 text-primary-foreground/90">
              Navegação
            </h4>
            <div className="flex flex-col space-y-3">
              {["Sobre Nós", "Contato", "Perguntas Frequentes", "Envios e Devoluções"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-body text-sm text-primary-foreground/50 font-light w-fit transition-all duration-300 hover:text-gold hover:translate-x-1"
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Redes Sociais */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-sm uppercase tracking-[0.2em] mb-6 text-primary-foreground/90">
              Conecte-se
            </h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/solershop_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-500 ease-out"
                aria-label="Instagram"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-500 ease-out"
                aria-label="Facebook"
              >
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-500 ease-out"
                aria-label="Email"
              >
                <Mail size={20} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-sm uppercase tracking-[0.2em] mb-6 text-primary-foreground/90">
              The Soler Club
            </h4>
            <p className="font-body text-sm text-primary-foreground/50 mb-5 font-light">
              Acesso antecipado a novidades e ofertas exclusivas.
            </p>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Seu endereço de e-mail"
                className="w-full bg-transparent border-b border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 font-body text-sm px-2 py-3 focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 text-gold uppercase tracking-wider font-body text-xs hover:text-primary-foreground transition-colors"
              >
                Assinar
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
          className="border-t border-primary-foreground/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-primary-foreground/30">
            <CreditCard size={24} strokeWidth={1} />
            <span className="font-body text-xs tracking-wider uppercase">
              Pix • Visa • Mastercard
            </span>
          </div>
          <p className="font-body text-xs text-primary-foreground/30 tracking-wider font-light">
            © 2026 SOLER SHOP. TODOS OS DIREITOS RESERVADOS.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;