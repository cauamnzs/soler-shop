import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import ProductGrid from "@/components/ProductGrid";
import WhyChoose from "@/components/WhyChoose";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import Spotlight from "@/components/Spotlight";
import FluidBackground from "@/components/FluidBackground"; // <-- Importamos a seda líquida

const Index = () => {
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
        <CategoryCards />
        <ProductGrid />
        <WhyChoose />
        <InstagramFeed />
      </main>
      <Footer />
    </div>
  );
};

export default Index;