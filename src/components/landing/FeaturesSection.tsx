import { Zap, Shield, BarChart3, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Criação Relâmpago",
    description:
      "Configure um torneio completo em menos de 2 minutos. Sem complicação, pronto para rodar.",
  },
  {
    icon: Shield,
    title: "Foco no Jogo, Sem Anúncios",
    description:
      "Experiência limpa criada para os jogadores. Sem propagandas chatas ou pegadinhas.",
  },
  {
    icon: BarChart3,
    title: "Resultados em Tempo Real",
    description:
      "Atualização de chaves ao vivo, placares instantâneos e avanço automático para a próxima fase.",
  },
  {
    icon: Smartphone,
    title: "Na Palma da Mão",
    description:
      "Design perfeito para qualquer tela. Acompanhe os jogos e os resultados direto da beira da quadra.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-foreground">
          Por que o <span className="text-gradient-primary">MatchUp</span>?
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
          Tudo o que você precisa para organizar torneios como um profissional —
          sem enrolação.
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
              <h3 className="font-bold text-lg mb-2 text-card-foreground">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
