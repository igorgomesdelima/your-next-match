import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, MapPin, Calendar, Trophy, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/landing/Navbar";

interface Tournament {
  id: string;
  name: string;
  date: string;
  end_date?: string;
  sport: string;
  price: number;
}

const BrowseTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  // Estados para os filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("Todos");

  // Busca inicial no banco de dados
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const { data, error } = await supabase
          .from("tournaments")
          .select("id, name, date, end_date, sport, price")
          .order("date", { ascending: true });

        if (error) throw error;

        if (data) {
          const formattedData = data as unknown as Tournament[];
          setTournaments(formattedData);
          setFilteredTournaments(formattedData); // Inicialmente, mostra todos
        }
      } catch (error) {
        console.error("Erro ao buscar torneios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // Efeito que roda toda vez que o usuário digita algo ou clica num filtro de esporte
  useEffect(() => {
    let result = tournaments;

    // Filtra pelo esporte (se não for "Todos")
    if (selectedSport !== "Todos") {
      result = result.filter(
        (t) => t.sport.toLowerCase() === selectedSport.toLowerCase(),
      );
    }

    // Filtra pelo texto digitado (busca no nome do torneio)
    if (searchTerm.trim() !== "") {
      result = result.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredTournaments(result);
  }, [searchTerm, selectedSport, tournaments]);

  // Lista de esportes para os botões de filtro
  const sportOptions = ["Todos", "Tennis", "Beach-Tennis", "Padel"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Cabeçalho e Barra de Busca */}
        <div className="mb-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Encontre seu próximo desafio
            </h1>
            <p className="text-muted-foreground">
              Busque por nome ou filtre pelo seu esporte favorito.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                placeholder="Buscar torneio pelo nome..."
                className="pl-10 h-12 text-base shadow-sm focus-visible:ring-[#0000FF]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <Filter
                className="text-muted-foreground mr-1 shrink-0"
                size={20}
              />
              {sportOptions.map((sport) => (
                <Button
                  key={sport}
                  variant={selectedSport === sport ? "default" : "outline"}
                  onClick={() => setSelectedSport(sport)}
                  className={`rounded-full shrink-0 ${selectedSport === sport ? "bg-[#0000FF] hover:bg-[#0000FF]/90 text-white" : ""}`}
                >
                  {sport.replace("-", " ")}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Área de Resultados */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0000FF]"></div>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border shadow-sm">
            <Trophy
              size={48}
              className="mx-auto text-muted-foreground mb-4 opacity-50"
            />
            <h3 className="text-xl font-bold mb-2">
              Nenhum torneio encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente mudar os filtros ou o termo de busca.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("");
                setSelectedSport("Todos");
              }}
              className="text-[#0000FF] mt-2"
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tourney) => (
              <Link
                to={`/tournament/${tourney.id}`}
                key={tourney.id}
                className="group cursor-pointer"
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-[#0000FF]/50 duration-300 h-full flex flex-col">
                  <div className="h-32 bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0000FF]/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase border border-border shadow-sm">
                      {tourney.sport.replace("-", " ")}
                    </div>
                  </div>

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
      </main>
    </div>
  );
};

export default BrowseTournaments;
