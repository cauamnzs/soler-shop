import { useEffect } from "react";
import Lenis from "lenis";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SensationVibes from "@/components/SensationVibes";
import ProductGrid from "@/components/ProductGrid";
import WhyChoose from "@/components/WhyChoose";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import Spotlight from "@/components/Spotlight";
import FluidBackground from "@/components/FluidBackground"; // <-- Importamos a seda líquida

const Index = () => {
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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    // Removemos o bg-background daqui e deixamos transparente!
    <div className="min-h-screen relative selection:bg-gold/20">
      
      {/* Camada 1: O Fundo Líquido Vivo */}
      <FluidBackground /> 
      
      {/* Camada 2: A Lanterna do Mouse */}
      <Spotlight />
      
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