import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Calendar, Users } from "lucide-react";
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

const Dashboard = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("tournaments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setTournaments(data);
        }
      } catch (error) {
        console.error("Erro ao buscar torneios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          {/* Logo corrigida com a técnica de Mask Image */}
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => supabase.auth.signOut()}
          >
            Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Meus Torneios
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas competições e inscrições.
            </p>
          </div>

          <Link to="/create">
            <Button className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white shadow-lg">
              <Plus size={20} className="mr-2" />
              Novo Torneio
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando seus torneios...
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-bold">Nenhum torneio criado</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não organizou nenhuma competição.
            </p>
            <Link to="/create">
              <Button variant="outline">Começar agora</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* O Escopo do torneio começa AQUI no map */}
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-[#0000FF]/10 text-[#0000FF] rounded-full text-xs font-bold uppercase tracking-wider">
                      {tournament.sport.replace("-", " ")}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded">
                      R$ {tournament.price}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-foreground line-clamp-2">
                    {tournament.name}
                  </h3>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={16} className="mr-2 text-[#00CED1]" />
                      {new Date(tournament.date).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users size={16} className="mr-2 text-[#FFD700]" />
                      Categorias: {tournament.categories}
                    </div>
                  </div>
                </div>

                {/* O botão Gerenciar está DENTRO do card, então a variável tournament.id funciona! */}
                <div className="px-6 py-3 bg-transparent border-t border-border flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground">
                    Status: Ativo
                  </span>
                  <Link to={`/manage/${tournament.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-[#0000FF] hover:bg-[#0000FF]/10"
                    >
                      Gerenciar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {/* O Escopo termina AQUI */}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
