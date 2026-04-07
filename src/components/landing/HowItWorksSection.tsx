import { PlusCircle, Users, Play } from "lucide-react";

const steps = [
  {
    icon: PlusCircle,
    step: "01",
    title: "Create",
    description: "Set up your tournament in minutes — pick format, sport, dates, and rules.",
  },
  {
    icon: Users,
    step: "02",
    title: "Invite",
    description: "Share a link or invite code. Players sign up and confirm their spot.",
  },
  {
    icon: Play,
    step: "03",
    title: "Play",
    description: "Track scores live, advance brackets automatically, and crown your champion.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-foreground">
          How It <span className="text-gradient-primary">Works</span>
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
          Three steps to a perfectly organized tournament.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="relative text-center animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-6 shadow-glow">
                <s.icon className="text-primary-foreground" size={32} />
              </div>
              <span className="text-xs font-bold text-primary tracking-widest uppercase">Step {s.step}</span>
              <h3 className="text-xl font-bold mt-2 mb-3 text-foreground">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-4 w-8 text-primary/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
