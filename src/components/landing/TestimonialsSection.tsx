const testimonials = [
  {
    name: "Lucas M.",
    role: "Tennis Coach",
    text: "MatchUp saved me hours every tournament. The bracket view is gorgeous and my players love tracking their matches live.",
    avatar: "LM",
  },
  {
    name: "Sofia R.",
    role: "Padel Club Manager",
    text: "We switched from spreadsheets to MatchUp and never looked back. Setup is incredibly fast and intuitive.",
    avatar: "SR",
  },
  {
    name: "André K.",
    role: "Beach Tennis Player",
    text: "Finally an app that looks and works like it was made in 2026. Clean, fast, and ad-free.",
    avatar: "AK",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 text-secondary-foreground">
          Loved by <span className="text-gradient-primary">Players</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="bg-card rounded-xl p-6 shadow-card animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="text-card-foreground/80 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-card-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
