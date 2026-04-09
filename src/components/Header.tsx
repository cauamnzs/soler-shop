import { useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import solerLogo from "@/assets/soler-logo.png";

// Categorias atualizadas com a Promoção no final para o destaque visual
const navLinks = ["Perfumes", "Body Lotion", "Body Splash", "Esfoliantes", "Kits", "Variedades", "Promoção"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#faf9f6]/40 backdrop-blur-xl border-b border-foreground/5 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img src={solerLogo} alt="Soler Shop" className="h-9 w-9 md:h-11 md:w-11" />
            <div className="leading-tight">
              <span className="font-heading text-lg md:text-xl font-semibold tracking-wide text-foreground">
                Soler Shop
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body">
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
                  hover:text-gold transition-colors duration-300 relative
                  after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full
                  after:h-[1.5px] after:bg-gold after:scale-x-0 after:origin-right
                  after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
              >
                {link === "Promoção" ? <span className="text-destructive font-semibold">{link}</span> : link}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3 md:gap-5">
            <button className="text-muted-foreground hover:text-gold transition-colors duration-300" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="text-muted-foreground hover:text-gold transition-colors duration-300 hidden sm:block" aria-label="Account">
              <User size={20} />
            </button>
            <button className="relative text-muted-foreground hover:text-gold transition-colors duration-300" aria-label="Cart">
              <ShoppingBag size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-primary-foreground text-[10px] font-body font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-[18px] min-h-[18px]">
                3
              </span>
            </button>
            <button
              className="lg:hidden text-muted-foreground hover:text-gold transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="lg:hidden bg-background border-t border-border animate-fade-up">
          <div className="section-padding py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-body font-medium tracking-wide text-muted-foreground hover:text-gold py-2 transition-colors"
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