import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SportsSection from "@/components/landing/SportsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import NewFooter from "@/components/layout/NewFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* O flex-1 garante que o conteúdo empurre o footer lá pro final da página */}
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <SportsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <NewFooter />
    </div>
  );
};

export default Index;
