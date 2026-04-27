import { useEffect, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Lenis from "lenis";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SensationVibes from "@/components/SensationVibes";
import ProductGrid from "@/components/ProductGrid";
import WhyChoose from "@/components/WhyChoose";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import Spotlight from "@/components/Spotlight";
import FluidBackground from "@/components/FluidBackground"; 
import CustomCursor from "@/components/CustomCursor"; 
import Preloader from "@/components/Preloader";
import SearchModal from "@/components/SearchModal";

// Tipo global para controle do Lenis
declare global {
  interface Window {
    lenisControl?: {
      stop: () => void;
      start: () => void;
    };
  }
}

const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

const Index = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (window.innerWidth < 768) return; // Native touch scroll is smoother on mobile
    const lenis = new Lenis({
      duration: 1.5,
      lerp: 0.07,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Expõe controle global para modais pausarem o scroll
    window.lenisControl = {
      stop: () => lenis.stop(),
      start: () => lenis.start(),
    };

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      delete window.lenisControl;
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-background selection:bg-gold/20 overflow-x-hidden">
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark via-gold to-gold-light z-[10001] origin-left pointer-events-none"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Camada Zero: O Carregamento Visionário */}
      <Preloader />
      <SearchModal />
      
      {/* Camada 1: O Fundo Líquido Vivo — desktop only */}
      {!isMobileDevice && <FluidBackground />}
      
      {/* Camada 2: A Lanterna do Mouse — desktop only (no mouse on mobile) */}
      {!isMobileDevice && <Spotlight />}

      {/* Camada Visionária: O Cursor Personalizado (Apenas Desktop) */}
      <CustomCursor />
      
      {/* Overlay de Grain Global — desktop only (expensive fixed SVG filter) */}
      {!isMobileDevice && (
        <div 
          className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.025] dark:opacity-[0.012] mix-blend-overlay dark:mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      )}
      
      {/* Camada 3: O Site em si */}
      <Header />
      <main className="relative z-10 pb-24 md:pb-0">
        <HeroSection />
        <SensationVibes />
        <ProductGrid />

        {/* Brand Names Strip */}
        <div className="relative overflow-hidden py-6 border-y border-border/15 group">
          <div className="flex items-center gap-16 whitespace-nowrap"
            style={{ animation: "marquee 26s linear infinite", animationPlayState: "running" }}
            onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
          >
            {[
              "Victoria's Secret", "Bath & Body Works", "Sol de Janeiro",
              "Kayali", "Jo Malone", "Maison Margiela", "Dossier", "Fragrance.One",
              "Victoria's Secret", "Bath & Body Works", "Sol de Janeiro",
              "Kayali", "Jo Malone", "Maison Margiela", "Dossier", "Fragrance.One",
            ].map((brand, i) => (
              <a
                key={i}
                href={`?brand=${encodeURIComponent(brand)}#products`}
                data-brand={brand}
                onClick={() => { try { navigator.vibrate?.(4); } catch {} }}
                className="touch-cta inline-flex items-center gap-8 font-heading text-xs sm:text-sm uppercase tracking-[0.4em] text-foreground/20 italic flex-shrink-0 hover:text-gold/70 transition-colors duration-300 active:text-gold"
              >
                {brand}
                <span className="text-gold/20 not-italic text-[8px]" aria-hidden="true">◆</span>
              </a>
            ))}
          </div>
        </div>

        <WhyChoose />
        <InstagramFeed />
      </main>
      <Footer />

      {/* Mobile Sticky CTA Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-[9960] rounded-2xl border border-white/10 bg-background/90 dark:bg-background/95 backdrop-blur-xl shadow-2xl p-2">
        <div className="grid grid-cols-2 gap-2">
          <a
            href="#products"
            onClick={() => { try { navigator.vibrate?.(6); } catch {} }}
            className="touch-cta inline-flex items-center justify-center rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-foreground border border-foreground/15 bg-foreground/[0.04] active:scale-[0.96] active:bg-foreground/[0.08] transition-transform duration-75"
          >
            Ver Catálogo
          </a>
          <a
            href="https://wa.me/5513991234567"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { try { navigator.vibrate?.(10); } catch {} }}
            className="touch-cta inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-background bg-gold active:scale-[0.96] active:brightness-90 transition-transform duration-75 shadow-[0_2px_12px_rgba(212,175,55,0.35)]"
          >
            <MessageCircle size={14} strokeWidth={1.7} />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/5513991234567"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar no WhatsApp"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:flex fixed bottom-6 right-6 z-[9960] w-14 h-14 bg-gold rounded-full items-center justify-center shadow-lux-hover group"
      >
        {/* Tooltip */}
        <span className="absolute right-full mr-4 whitespace-nowrap bg-foreground text-background font-body text-[10px] uppercase tracking-[0.2em] px-3 py-2 rounded-full opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-lg">
          Comprar agora
        </span>
        <span className="absolute inset-0 rounded-full bg-gold/50 animate-ping" style={{ animationDuration: '2.8s' }} />
        <MessageCircle className="relative text-background" size={24} strokeWidth={1.5} />
      </motion.a>
    </div>
  );
};

export default Index;