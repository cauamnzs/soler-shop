import { useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import solerLogo from "@/assets/soler-logo.png";

// Categorias atualizadas com a Promoção no final para o destaque visual
const navLinks = ["Perfumes", "Body Lotion", "Body Splash", "Esfoliantes", "Kits", "Variedades", "Promoção"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#faf9f6]/60 backdrop-blur-xl border-t border-t-white/20 border-b border-b-black/5 shadow-lux transition-all duration-500 ease-lux">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0 group transition-lux duration-500">
            <img src={solerLogo} alt="Soler Shop" className="h-9 w-9 md:h-11 md:w-11 transition-lux duration-500 group-hover:scale-105" />
            <div className="leading-tight">
              <span className="font-heading text-lg md:text-xl font-semibold tracking-wide text-foreground">
                Soler Shop
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body">
                Importados
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-body font-medium tracking-wide text-muted-foreground
                  hover:text-gold transition-lux duration-500 relative
                  after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full
                  after:h-[1.5px] after:bg-gold after:scale-x-0 after:origin-right
                  after:transition-transform after:duration-500 after:ease-lux hover:after:scale-x-100 hover:after:origin-left"
              >
                {link === "Promoção" ? <span className="text-destructive font-semibold">{link}</span> : link}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-3 md:gap-5">
            <button className="p-2 text-muted-foreground hover:text-gold transition-lux duration-500" aria-label="Pesquisar">
              <Search size={20} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-gold transition-lux duration-500 hidden sm:block" aria-label="Minha Conta">
              <User size={20} />
            </button>
            <button className="p-2 relative text-muted-foreground hover:text-gold transition-lux duration-500" aria-label="Carrinho de Compras">
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 bg-gold text-primary-foreground text-[10px] font-body font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-[18px] min-h-[18px] shadow-lux">
                3
              </span>
            </button>
            <button
              className="p-2 lg:hidden text-muted-foreground hover:text-gold transition-lux duration-500"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="lg:hidden bg-[#faf9f6] border-t border-black/5 animate-fade-up shadow-xl">
          <div className="section-padding py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-base font-body font-medium tracking-wide text-muted-foreground hover:text-gold py-4 border-b border-black/5 last:border-0 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link === "Promoção" ? <span className="text-destructive font-semibold">{link}</span> : link}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;