import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  Trophy,
  ArrowRight,
  Settings,
} from "lucide-react";

interface UserRegistration {
  id: string;
  category: string;
  status: string;
  tournaments: {
    id: string;
    name: string;
    date: string;
    sport: string;
  };
}

// Interface para os torneios que o usuário criou
interface MyTournament {
  id: string;
  name: string;
  date: string;
  sport: string;
}

const Dashboard = () => {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [organizedTournaments, setOrganizedTournaments] = useState<
    MyTournament[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        const userProfile = profile as { full_name: string | null } | null;
        if (userProfile?.full_name)
          setUserName(userProfile.full_name.split(" ")[0]);

        // 1. Busca Inscrições (Como Jogador)
        const { data: regData } = await supabase
          .from("participants")
          .select(`id, category, status, tournaments (id, name, date, sport)`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (regData) setRegistrations(regData as unknown as UserRegistration[]);

        // 2. Busca Torneios Criados (Como Organizador)
        const { data: orgData } = await supabase
          .from("tournaments")
          .select("id, name, date, sport")
          .eq("user_id", user.id)
          .order("date", { ascending: true });

        if (orgData) setOrganizedTournaments(orgData as MyTournament[]);
      } catch (error) {
        console.error("Erro no dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-4 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Olá{userName ? `, ${userName}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle do MatchUp.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0000FF]"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* SEÇÃO 1: VISÃO DO ORGANIZADOR */}
            {organizedTournaments.length > 0 && (
              <section>
                <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2 mb-6">
                  <Settings className="text-[#0000FF]" size={24} /> Torneios que
                  Organizo
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {organizedTournaments.map((t) => (
                    <Link to={`/manage/${t.id}`} key={t.id}>
                      <div className="bg-card p-5 rounded-xl border border-[#0000FF]/30 hover:border-[#0000FF] transition-all shadow-sm flex flex-col h-full group">
                        <p className="text-xs font-bold text-[#0000FF] uppercase mb-1">
                          {t.sport.replace("-", " ")}
                        </p>
                        <h3 className="font-bold text-lg mb-4 group-hover:text-[#0000FF] transition-colors">
                          {t.name}
                        </h3>
                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar size={14} />{" "}
                            {new Date(t.date).toLocaleDateString("pt-BR")}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="group-hover:bg-[#0000FF] group-hover:text-white transition-colors"
                          >
                            Gerenciar
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* SEÇÃO 2: VISÃO DO JOGADOR */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2 mb-6">
                <Trophy className="text-[#0000FF]" size={24} /> Minhas
                Inscrições
              </h2>

              {registrations.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border shadow-sm">
                  <p className="text-muted-foreground">
                    Você ainda não está inscrito em nada.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registrations.map((reg) => (
                    <Link
                      to={`/tournament/${reg.tournaments.id}`}
                      key={reg.id}
                      className="group"
                    >
                      <div className="bg-card p-5 rounded-xl border border-border hover:border-[#0000FF]/50 transition-colors shadow-sm flex gap-5">
                        <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center min-w-[80px] border border-border">
                          <span className="text-xs font-bold text-muted-foreground uppercase mb-1">
                            {new Date(reg.tournaments.date)
                              .toLocaleDateString("pt-BR", { month: "short" })
                              .replace(".", "")}
                          </span>
                          <span className="text-2xl font-black">
                            {new Date(reg.tournaments.date).getDate()}
                          </span>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-bold text-[#0000FF] uppercase mb-1">
                                {reg.tournaments.sport.replace("-", " ")}
                              </p>
                              <h3 className="font-bold text-lg leading-tight group-hover:text-[#0000FF]">
                                {reg.tournaments.name}
                              </h3>
                            </div>
                            <ArrowRight
                              size={18}
                              className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"
                            />
                          </div>

                          <div className="flex flex-wrap gap-3 pt-2">
                            <div className="flex items-center text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                              <Tag size={14} className="mr-1.5" /> Cat:{" "}
                              <strong className="ml-1">
                                {reg.category || "N/A"}
                              </strong>
                            </div>

                            {reg.status?.toLowerCase() === "confirmado" ? (
                              <div className="flex items-center text-sm text-green-600 bg-green-500/10 px-2 py-1 rounded-md">
                                <CheckCircle size={14} className="mr-1.5" />{" "}
                                Confirmado
                              </div>
                            ) : (
                              <div className="flex items-center text-sm text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                                <Clock size={14} className="mr-1.5" />{" "}
                                {reg.status || "Pendente"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
