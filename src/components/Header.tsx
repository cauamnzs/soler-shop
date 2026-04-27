import { useState, useEffect } from "react";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import solerLogo from "@/assets/soler-logo.png";

// Categorias atualizadas com a Promoção no final para o destaque visual
const navLinks = ["Perfumes", "Body Lotion", "Body Splash", "Esfoliantes", "Kits", "Variedades", "Promoção"];

const navHrefMap: Record<string, string> = {
  Perfumes: "?filter=Perfumes#products",
  "Body Lotion": "?filter=Body%20Lotion#products",
  "Body Splash": "?filter=Body%20Splash#products",
  Esfoliantes: "?filter=Esfoliantes#products",
  Kits: "?filter=Kits#products",
  Variedades: "?filter=Variedades#products",
  Promoção: "?filter=Promo%C3%A7%C3%A3o#products",
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();
  
  // Prevent hydration mismatch - render placeholder until mounted
  if (!mounted) {
    return (
      <div className="w-9 h-9" />
    );
  }
  
  return (
    <button
      onClick={() => { try { navigator.vibrate?.(5); } catch {}; toggleTheme(); }}
      className="touch-cta relative p-2 text-muted-foreground hover:text-gold transition-lux duration-500 rounded-lg hover:bg-gold/10 active:scale-90"
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
    >
      <div className="relative w-5 h-5">
        <Sun 
          size={20} 
          className={`absolute inset-0 transition-all duration-500 ${theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"}`}
        />
        <Moon 
          size={20} 
          className={`absolute inset-0 transition-all duration-500 ${theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
        />
      </div>
    </button>
  );
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-[9970] transition-all duration-500 ease-lux ${scrolled ? 'shadow-[0_4px_32px_rgba(0,0,0,0.14)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]' : ''}`} style={{ backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)' }}>
      {/* Glass surface */}
      <div className={`absolute inset-0 transition-all duration-500 border-b border-white/30 dark:border-white/[0.08] ${scrolled ? 'bg-white/75 dark:bg-black/55' : 'bg-white/50 dark:bg-black/30'} shadow-[0_1px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.3)]`} />
      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-14 md:h-16 lg:h-18' : 'h-16 md:h-20 lg:h-24'}`}>
          {/* Logo */}
          <a href="/" data-cursor-label="Início" className="touch-cta flex items-center gap-2 shrink-0 group transition-lux duration-500 active:opacity-70">
            <img src={solerLogo} alt="Soler Shop" className="h-9 w-9 md:h-11 md:w-11 lg:h-12 lg:w-12 transition-lux duration-500 group-hover:scale-105" />
            <div className="leading-tight">
              <span className="font-heading text-lg md:text-xl lg:text-2xl font-semibold tracking-wide text-foreground whitespace-nowrap">
                Soler Shop
              </span>
              <span className="hidden sm:block text-[10px] lg:text-xs uppercase tracking-[0.3em] text-muted-foreground font-body whitespace-nowrap">
                Importados
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={navHrefMap[link] ?? "#products"}
                data-cursor-label="Explorar"
                className="text-xs xl:text-sm font-body font-medium tracking-wide text-muted-foreground
                  hover:text-gold transition-lux duration-500 relative whitespace-nowrap
                  after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full
                  after:h-[1px] after:bg-gold after:scale-x-0 after:origin-right
                  after:transition-transform after:duration-500 after:ease-lux hover:after:scale-x-100 hover:after:origin-left"
              >
                {link === "Promoção" ? (
                  <span className="relative text-destructive font-semibold">
                    {link}
                    <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                  </span>
                ) : link}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
            <button
              className="touch-cta p-2.5 text-muted-foreground hover:text-gold transition-lux duration-500 active:scale-90 active:text-gold"
              aria-label="Pesquisar"
              onClick={() => { try { navigator.vibrate?.(6); } catch {}; window.dispatchEvent(new CustomEvent("soler:search:open")); }}
            >
              <Search size={20} />
            </button>
            <ThemeToggle />
            <button
              className="touch-cta p-2 lg:hidden text-muted-foreground hover:text-gold transition-lux duration-500 active:scale-90"
              onClick={() => { try { navigator.vibrate?.(8); } catch {}; setMobileOpen(!mobileOpen); }}
              aria-label={mobileOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav — Glass Panel */}
      {mobileOpen && (
        <nav className="lg:hidden animate-fade-up border-t border-white/20 dark:border-white/[0.06]" style={{ backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)' }}>
          <div className="relative bg-white/40 dark:bg-black/30 px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-1 shadow-xl">
            {navLinks.map((link) => (
              <a
                key={link}
                href={navHrefMap[link] ?? "#products"}
                className="touch-cta flex items-center justify-between text-base font-body font-medium tracking-wide text-muted-foreground hover:text-gold py-4 border-b border-foreground/5 last:border-0 transition-all duration-300 group/nav hover:pl-1 active:text-gold active:pl-1"
                onClick={() => { try { navigator.vibrate?.(5); } catch {}; setMobileOpen(false); }}
              >
                {link === "Promoção" ? (
                  <span className="relative text-destructive font-semibold">
                    {link}
                    <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                  </span>
                ) : link}
                <span className="text-gold text-sm opacity-0 -translate-x-1 group-hover/nav:opacity-100 group-hover/nav:translate-x-0 transition-all duration-300">→</span>
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;