import { useEffect, useRef } from "react";
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

// Tipo global para controle do Lenis
declare global {
  interface Window {
    lenisControl?: {
      stop: () => void;
      start: () => void;
    };
  }
}

const Index = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
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
      
      {/* Camada Zero: O Carregamento Visionário */}
      <Preloader />
      
      {/* Camada 1: O Fundo Líquido Vivo */}
      <FluidBackground /> 
      
      {/* Camada 2: A Lanterna do Mouse */}
      <Spotlight />

      {/* Camada Visionária: O Cursor Personalizado (Apenas Desktop) */}
      <CustomCursor />
      
      {/* Overlay de Grain Global (Textura Analógica) — reduzido no dark */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.025] dark:opacity-[0.012] mix-blend-overlay dark:mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Camada 3: O Site em si */}
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <SensationVibes />
        <ProductGrid />
        <WhyChoose />
        <InstagramFeed />
      </main>
      <Footer />
    </div>
  );
};

export default Index;