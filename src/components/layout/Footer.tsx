import { Link } from "react-router-dom";
import logo from "@/assets/matchup-logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border/20 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="MatchUp" width={28} height={28} loading="lazy" />
            <span className="text-lg font-extrabold text-secondary-foreground tracking-tight">
              Match<span className="text-gradient-primary">Up</span>
            </span>
          </Link>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#sports" className="hover:text-foreground transition-colors">Sports</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
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
