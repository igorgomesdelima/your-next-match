import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, Trophy } from "lucide-react";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/matchup-logo.png";
import { supabase } from "@/integrations/supabase/client";

interface Tournament {
  id: string;
  name: string;
  date: string;
  sport: string;
  categories: string;
  price: number;
}

const BrowseTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllTournaments = async () => {
      try {
        // Busca TODOS os torneios no banco de dados, sem filtrar por usuário
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("tournaments")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setTournaments(data);
      } catch (error) {
        console.error("Erro ao buscar torneios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTournaments();
  }, []);

  // Lógica de pesquisa no Front-end (Filtra a lista pelo nome digitado)
  const filteredTournaments = tournaments.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 bg-[#0000FF]"
              style={{
                WebkitMaskImage: `url(${logo})`,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskImage: `url(${logo})`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
              }}
            />
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-[#00CED1]">Match</span>
              <span className="text-[#FFD700]">Up</span>
            </span>
          </Link>
          <div className="flex gap-4">
            <Link to="/auth">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/create">
              <Button className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white">
                Criar Torneio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Explorar Torneios
          </h1>
          <p className="text-muted-foreground text-lg">
            Encontre as melhores competições e junte-se ao jogo.
          </p>

          <div className="relative max-w-md mt-6">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              placeholder="Buscar por nome do torneio..."
              className="pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Carregando competições...</div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum torneio encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-[#0000FF]/10 text-[#0000FF] rounded-full text-xs font-bold uppercase tracking-wider">
                      {tournament.sport.replace("-", " ")}
                    </span>
                    <span className="text-xs font-bold bg-[#FFD700]/20 text-[#FFD700] px-3 py-1 rounded-full">
                      R$ {tournament.price}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{tournament.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={16} className="mr-2 text-[#00CED1]" />{" "}
                      {new Date(tournament.date).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users size={16} className="mr-2 text-[#FFD700]" />{" "}
                      Categorias: {tournament.categories}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-border mt-auto">
                  <Link to={`/tournament/${tournament.id}`}>
                    <Button className="w-full bg-[#0000FF] hover:bg-[#0000FF]/90 text-white">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BrowseTournaments;
