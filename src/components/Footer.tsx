import { Instagram, Facebook, Mail, CreditCard } from "lucide-react";
import solerLogo from "@/assets/soler-logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto section-padding py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={solerLogo} alt="Soler Shop" className="h-10 w-10" />
              <span className="font-heading text-xl text-primary-foreground">Soler Shop</span>
            </div>
            <p className="font-body text-sm text-primary-foreground/60 leading-relaxed">
              Produtos importados premium selecionados por Nós. Trazendo luxo e cuidado para sua rotina diária.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-base mb-5 text-primary-foreground">Navegação</h4>
            {["Sobre Nós", "Contato", "Perguntas Frequentes", "Envio & Devoluções"].map((link) => (
              <a
                key={link}
                href="#"
                className="block font-body text-sm text-primary-foreground/60 hover:text-gold transition-colors mb-2.5"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading text-base mb-5 text-primary-foreground">Siga-nos</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/solershop_" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-base mb-5 text-primary-foreground">Fique Por Dentro - Soler</h4>
            <p className="font-body text-sm text-primary-foreground/60 mb-4">
              Receba ofertas exclusivas, novidades e dicas de beleza.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm px-4 py-2.5 border border-primary-foreground/20 rounded-l-sm focus:outline-none focus:border-gold"
              />
              <button type="submit" className="bg-gold text-primary-foreground font-body text-sm font-semibold px-5 py-2.5 rounded-r-sm hover:bg-gold-dark transition-colors">
                Entrar
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-primary-foreground/40" />
            <span className="font-body text-xs text-primary-foreground/40">
              Visa • Mastercard • Pix • Boleto
            </span>
          </div>
          <p className="font-body text-xs text-primary-foreground/40">
            © 2026 Soler Shop Importados. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
