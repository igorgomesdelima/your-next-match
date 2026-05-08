import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-secondary-foreground mb-6">
          Pronto para{" "}
          <span className="text-gradient-primary">elevar o nível</span> dos seus
          torneios?
        </h2>
        <p className="text-secondary-foreground/60 text-lg mb-10 max-w-xl mx-auto">
          Junte-se aos jogadores e organizadores que já estão transformando o
          esporte com o MatchUp.
        </p>
        <Link to="/create">
          <Button
            variant="hero"
            size="lg"
            className="text-base px-10 py-6 gap-2"
          >
            Comece Grátis
            <ArrowRight size={20} />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
