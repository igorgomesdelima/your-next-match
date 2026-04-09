import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Calendar, Users, User, Medal } from "lucide-react";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/matchup-logo.png";
import { supabase } from "@/integrations/supabase/client";

// Nossos moldes (Interfaces)
interface Tournament {
  id: string;
  name: string;
  date: string;
  sport: string;
  categories: string;
  price: number;
}

// Interface da Inscrição que traz os dados do torneio junto (JOIN)
interface Participation {
  id: string;
  category: string;
  status: string;
  tournaments: Tournament; // Os dados do torneio vêm aninhados aqui!
}

const Dashboard = () => {
  // Estados para guardar as duas listas
  const [organizedTournaments, setOrganizedTournaments] = useState<
    Tournament[]
  >([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);

  // Controle de Abas (Qual visão o usuário está vendo agora?)
  const [activeTab, setActiveTab] = useState<"playing" | "organizing">(
    "playing",
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Busca os torneios que o usuário ORGANIZA
        const { data: orgData, error: orgError } = await supabase
          .from("tournaments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (orgError) throw orgError;
        if (orgData) setOrganizedTournaments(orgData as Tournament[]);

        // 2. Busca os torneios em que o usuário VAI JOGAR (JOIN)
        const { data: partData, error: partError } = await supabase
          .from("participants")
          .select(
            `
            id,
            category,
            status,
            tournaments (*) 
          `,
          )
          .eq("user_id", user.id); // Filtra pelas inscrições do usuário logado

        if (partError) throw partError;

        // Remove inscrições cujo torneio foi deletado (órfãos) e salva no state
        if (partData) {
          const validParticipations = (
            partData as unknown as Participation[]
          ).filter((p) => p.tournaments !== null);
          setParticipations(validParticipations);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <User size={18} className="mr-2 hidden sm:inline-block" />
                Meu Perfil
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => supabase.auth.signOut()}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Cabeçalho e Sistema de Abas */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus jogos e competições.
            </p>
          </div>

          {/* Botões de Troca de Aba */}
          <div className="flex bg-secondary p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveTab("playing")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "playing" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Minhas Inscrições
            </button>
            <button
              onClick={() => setActiveTab("organizing")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "organizing" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Meus Torneios
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando informações...
          </div>
        ) : (
          <>
            {/* ================= ABA: MINHAS INSCRIÇÕES (JOGADOR) ================= */}
            {activeTab === "playing" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <Medal className="mr-2 text-[#FFD700]" /> Próximos Jogos
                  </h2>
                  <Link to="/browse">
                    <Button variant="outline" size="sm">
                      Explorar mais
                    </Button>
                  </Link>
                </div>

                {participations.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border">
                    <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-bold">
                      Nenhuma inscrição encontrada
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Você ainda não se inscreveu em nenhum torneio.
                    </p>
                    <Link to="/browse">
                      <Button className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white">
                        Procurar Torneios
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {participations.map((part) => (
                      <div
                        key={part.id}
                        className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-[#0000FF]/10 text-[#0000FF] rounded-full text-xs font-bold uppercase tracking-wider">
                              {part.tournaments.sport.replace("-", " ")}
                            </span>
                            <span className="text-xs font-bold bg-green-500/10 text-green-500 px-3 py-1 rounded-full">
                              Inscrito
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 line-clamp-2">
                            {part.tournaments.name}
                          </h3>
                          <div className="space-y-2 mt-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar
                                size={16}
                                className="mr-2 text-[#00CED1]"
                              />
                              {new Date(
                                part.tournaments.date,
                              ).toLocaleDateString("pt-BR")}
                            </div>
                            <div className="flex items-center text-sm font-bold">
                              <Users
                                size={16}
                                className="mr-2 text-[#FFD700]"
                              />
                              Sua Categoria:{" "}
                              <span className="ml-1 text-[#FFD700]">
                                {part.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-3 bg-secondary/30 border-t border-border flex justify-between items-center">
                          <Link
                            to={`/tournament/${part.tournaments.id}`}
                            className="w-full"
                          >
                            <Button
                              variant="ghost"
                              className="w-full text-[#0000FF] hover:bg-[#0000FF]/10 font-bold"
                            >
                              Página do Torneio
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= ABA: MEUS TORNEIOS (ORGANIZADOR) ================= */}
            {activeTab === "organizing" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <Users className="mr-2 text-[#0000FF]" /> Torneios que
                    Organizo
                  </h2>
                  <Link to="/create">
                    <Button className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white shadow-sm">
                      <Plus size={16} className="mr-2" /> Novo Torneio
                    </Button>
                  </Link>
                </div>

                {organizedTournaments.length === 0 ? (
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
                    {organizedTournaments.map((tournament) => (
                      /* Card padronizado com fundo branco e sem barras cinzas */
                      <div
                        key={tournament.id}
                        className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-[#0000FF]/10 text-[#0000FF] rounded-full text-xs font-bold uppercase tracking-wider">
                              {tournament.sport.replace("-", " ")}
                            </span>
                            {/* Mostramos o preço no canto superior direito para combinar com outros cards */}
                            <span className="text-xs font-bold bg-[#FFD700]/10 text-[#FFD700] px-3 py-1 rounded-full">
                              R$ {tournament.price}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold mb-2 text-foreground line-clamp-2">
                            {tournament.name}
                          </h3>

                          <div className="space-y-2 mt-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar
                                size={16}
                                className="mr-2 text-[#00CED1]"
                              />
                              {new Date(tournament.date).toLocaleDateString(
                                "pt-BR",
                              )}
                            </div>
                            <div className="flex items-center text-sm font-bold text-muted-foreground">
                              <Users
                                size={16}
                                className="mr-2 text-[#FFD700]"
                              />
                              Categorias: {tournament.categories}
                            </div>
                          </div>
                        </div>

                        {/* Rodapé limpo com botão sólido azul para gerenciar */}
                        <div className="px-6 py-4 border-t border-border mt-auto">
                          <Link to={`/manage/${tournament.id}`}>
                            <Button className="w-full bg-[#0000FF] hover:bg-[#0000FF]/90 text-white font-bold transition-colors">
                              Gerenciar Torneio
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
