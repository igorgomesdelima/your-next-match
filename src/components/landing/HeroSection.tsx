import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { Trophy, Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-secondary/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center py-32">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-secondary-foreground leading-tight mb-6 animate-fade-in">
          Your game.
          <br />
          <span className="text-gradient-primary">Your tournament.</span>
        </h1>

        <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          Create, manage, and compete in sports tournaments — beautifully simple, blazingly fast, and built for players.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link to="/create">
            <Button variant="hero" size="lg" className="text-base px-8 py-6 gap-2">
              <Trophy size={20} />
              Create Tournament
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 gap-2">
              <Search size={20} />
              Find a Tournament
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
