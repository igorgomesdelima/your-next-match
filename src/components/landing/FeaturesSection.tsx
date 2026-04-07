import { Zap, Shield, BarChart3, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create a full tournament in under 2 minutes. No clutter, no confusion.",
  },
  {
    icon: Shield,
    title: "No Ads, No Dark Patterns",
    description: "Clean experience built for players, not advertisers. Your data stays yours.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Results",
    description: "Live bracket updates, instant score tracking, and automatic advancement.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Beautiful on every screen. Check brackets and scores from the court.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-foreground">
          Why <span className="text-gradient-primary">MatchUp</span>?
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
          Everything you need to run tournaments like a pro — nothing you don't.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-card-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
