import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Search, Calendar, BarChart3 } from "lucide-react";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/matchup-logo.png";

const quickActions = [
  { icon: Trophy, label: "Create Tournament", to: "/create", variant: "hero" as const },
  { icon: Search, label: "Browse Tournaments", to: "/browse", variant: "outline" as const },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="MatchUp" width={28} height={28} />
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Match<span className="text-gradient-primary">Up</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to}>
              <Button variant={a.variant} className="w-full h-16 text-base gap-3">
                <a.icon size={22} />
                {a.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Active Tournaments */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-primary" /> Active Tournaments
          </h2>
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground">No active tournaments yet.</p>
            <Link to="/create">
              <Button variant="link" className="mt-2">Create your first tournament →</Button>
            </Link>
          </div>
        </section>

        {/* Recent Results */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" /> Recent Results
          </h2>
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground">No match results yet. Join a tournament to get started!</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
