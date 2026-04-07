import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import ProductGrid from "@/components/ProductGrid";
import WhyChoose from "@/components/WhyChoose";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
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
