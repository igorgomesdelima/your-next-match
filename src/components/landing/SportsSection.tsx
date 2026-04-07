const sports = [
  { name: "Tennis", emoji: "🎾" },
  { name: "Beach Tennis", emoji: "🏖️" },
  { name: "Padel", emoji: "🏓" },
  { name: "Squash", emoji: "🏸" },
  { name: "Badminton", emoji: "🏸" },
  { name: "Pickleball", emoji: "🥒" },
];

const SportsSection = () => {
  return (
    <section id="sports" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-secondary-foreground">
          Built for <span className="text-gradient-primary">Your Sport</span>
        </h2>
        <p className="text-secondary-foreground/60 mb-16 max-w-lg mx-auto">
          Optimized scoring, formats, and rules for each racket sport.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {sports.map((sport, i) => (
            <div
              key={sport.name}
              className="bg-secondary-foreground/5 hover:bg-secondary-foreground/10 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-4xl mb-3">{sport.emoji}</div>
              <p className="font-semibold text-sm text-secondary-foreground">{sport.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SportsSection;
