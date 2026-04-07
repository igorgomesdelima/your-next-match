import { Link } from "react-router-dom";
import logo from "@/assets/matchup-logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border/20 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            {/* Máscara Azul Forte para a Logo no Footer (w-7 e h-7 = 28px) */}
            <div
              className="w-7 h-7 bg-[#0000FF]"
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

            {/* Texto com as novas cores */}
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-[#00CED1]">Match</span>
              <span className="text-[#FFD700]">Up</span>
            </span>
          </Link>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#sports"
              className="hover:text-foreground transition-colors"
            >
              Sports
            </a>
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 MatchUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
