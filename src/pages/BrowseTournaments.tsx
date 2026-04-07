import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/matchup-logo.png";

const BrowseTournaments = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="MatchUp" width={28} height={28} />
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Match<span className="text-gradient-primary">Up</span>
            </span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-extrabold text-foreground mb-6">Find Tournaments</h1>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input className="pl-10" placeholder="Search by name, sport, or location..." />
        </div>

        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Search size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-2">No tournaments available yet.</p>
          <p className="text-sm text-muted-foreground">Be the first to create one!</p>
          <Link to="/create">
            <Button className="mt-4">Create Tournament</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseTournaments;
