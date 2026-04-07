import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/matchup-logo.png";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          {/* Técnica de Mask: Cria um fundo Azul Forte e usa sua logo como molde */}
          <div
            className="w-9 h-9 bg-[#0000FF]"
            style={{
              WebkitMaskImage: `url(${logo})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: `url(${logo})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />

          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-[#00CED1]">Match</span>
            <span className="text-[#FFD700]">Up</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-sm font-medium text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#sports"
            className="text-sm font-medium text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
          >
            Sports
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
          >
            How It Works
          </a>
          <Link to="/dashboard">
            <Button size="sm">Open App</Button>
          </Link>
        </div>

        <button
          className="md:hidden text-secondary-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-secondary border-t border-border/20 px-4 pb-4 space-y-3 animate-fade-in">
          <a
            href="#features"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-secondary-foreground/70 py-2"
          >
            Features
          </a>
          <a
            href="#sports"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-secondary-foreground/70 py-2"
          >
            Sports
          </a>
          <a
            href="#how-it-works"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-secondary-foreground/70 py-2"
          >
            How It Works
          </a>
          <Link to="/dashboard" onClick={() => setOpen(false)}>
            <Button className="w-full" size="sm">
              Open App
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
