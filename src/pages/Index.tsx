import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SportsSection from "@/components/landing/SportsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/layout/Footer";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Defina a interface logo abaixo dos imports
interface Tournament {
  id: string;
  name: string;
  date: string;
  sport: string;
  price: number;
}

const Index = () => {
  // 1. Criamos os estados para guardar os torneios e o aviso de carregamento
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Usamos o useEffect para buscar os dados assim que a página abre
  useEffect(() => {
    const fetchFeaturedTournaments = async () => {
      try {
        const { data, error } = await supabase
          .from("tournaments")
          .select("id, name, date, sport, price") // Pegamos só o que vamos mostrar no card
          .order("date", { ascending: true }) // Ordena do mais próximo para o mais distante
          .limit(3); // Pega apenas os 3 primeiros para a Home

        if (error) throw error;
        if (data) setTournaments(data as unknown as Tournament[]);
      } catch (error) {
        console.error("Erro ao buscar torneios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedTournaments();
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      {/* Seção Dinâmica: Torneios em Destaque */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Torneios em Destaque</h2>
            <p className="text-muted-foreground">
              Inscreva-se nos próximos eventos da sua região.
            </p>
          </div>
          <Link to="/browse">
            <Button variant="outline" className="hidden md:flex">
              Ver todos <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Verifica se está carregando */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0000FF]"></div>
          </div>
        ) : tournaments.length === 0 ? (
          // Caso o banco esteja vazio
          <div className="text-center py-12 bg-card rounded-xl border border-border shadow-sm">
            <Trophy
              size={48}
              className="mx-auto text-muted-foreground mb-4 opacity-50"
            />
            <h3 className="text-lg font-bold">Nenhum torneio em breve</h3>
            <p className="text-muted-foreground">
              Os organizadores ainda não publicaram novos torneios.
            </p>
          </div>
        ) : (
          // Mostra os cards puxados do banco
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tourney) => (
              <Link
                to={`/tournament/${tourney.id}`}
                key={tourney.id}
                className="group cursor-pointer"
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-[#0000FF]/50 duration-300 h-full flex flex-col">
                  {/* Capa do Torneio */}
                  <div className="h-32 bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0000FF]/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase border border-border shadow-sm">
                      {tourney.sport.replace("-", " ")}
                    </div>
                  </div>

                  {/* Infos do Torneio */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[#0000FF] transition-colors line-clamp-1">
                      {tourney.name}
                    </h3>

                    <div className="space-y-2 mt-auto mb-5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {new Date(tourney.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>Local a definir</span>
                      </div>
                    </div>

                    {/* Rodapé do Card (Preço e Botão) */}
                    <div className="pt-4 border-t border-border flex justify-between items-center mt-auto">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          Inscrição
                        </p>
                        <p className="font-bold text-[#FFD700]">
                          R$ {tourney.price}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white rounded-full px-5"
                      >
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <FeaturesSection />
      <SportsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
