import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  Trophy,
  MapPin,
  ArrowRight,
} from "lucide-react";

// Como fizemos um JOIN, a tipagem reflete as duas tabelas juntas
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

const Dashboard = () => {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndRegistrations = async () => {
      try {
        // 1. Pega quem é o usuário logado
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/auth"); // Se não estiver logado, chuta para a tela de login
          return;
        }

        // Busca o nome do perfil (opcional, só para deixar amigável)
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        // Tipamos exatamente o que esperamos do banco, deixando o ESLint e o TypeScript felizes
        const userProfile = profile as { full_name: string | null } | null;

        // O ponto de interrogação (?.) já faz a verificação de segurança (Optional Chaining)
        if (userProfile?.full_name) {
          setUserName(userProfile.full_name.split(" ")[0]);
        }

        // 2. A Mágica do JOIN: Busca as inscrições e já puxa os dados do torneio junto
        const { data, error } = await supabase
          .from("participants")
          .select(
            `
            id,
            category,
            status,
            tournaments (
              id,
              name,
              date,
              sport
            )
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          // Precisamos forçar a tipagem porque o TypeScript do Supabase para JOINs é meio chato
          setRegistrations(data as unknown as UserRegistration[]);
        }
      } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndRegistrations();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Olá{userName ? `, ${userName}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seus próximos desafios e gerencie suas inscrições.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2">
            <Trophy className="text-[#0000FF]" size={24} /> Minhas Inscrições
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0000FF]"></div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-border shadow-sm">
              <Trophy
                size={48}
                className="mx-auto text-muted-foreground mb-4 opacity-30"
              />
              <h3 className="text-xl font-bold mb-2">
                Você ainda não está inscrito em nada
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Descubra torneios incríveis acontecendo perto de você e coloque
                seu jogo à prova.
              </p>
              <Link to="/browse">
                <Button className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white rounded-full px-8">
                  Encontrar Torneios
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registrations.map((reg) => (
                <Link
                  to={`/tournament/${reg.tournaments.id}`}
                  key={reg.id}
                  className="group"
                >
                  <div className="bg-card p-5 rounded-xl border border-border hover:border-[#0000FF]/50 transition-colors shadow-sm flex flex-col sm:flex-row gap-5">
                    {/* Data/Calendário Visual */}
                    <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center min-w-[80px] text-center border border-border group-hover:bg-[#0000FF]/5 transition-colors">
                      <span className="text-xs font-bold text-muted-foreground uppercase mb-1">
                        {new Date(reg.tournaments.date)
                          .toLocaleDateString("pt-BR", { month: "short" })
                          .replace(".", "")}
                      </span>
                      <span className="text-2xl font-black text-foreground">
                        {new Date(reg.tournaments.date).getDate()}
                      </span>
                    </div>

                    {/* Detalhes da Inscrição */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-[#0000FF] uppercase mb-1">
                            {reg.tournaments.sport.replace("-", " ")}
                          </p>
                          <h3 className="font-bold text-lg leading-tight group-hover:text-[#0000FF] transition-colors line-clamp-1">
                            {reg.tournaments.name}
                          </h3>
                        </div>
                        <ArrowRight
                          size={18}
                          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1"
                        />
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <div className="flex items-center text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                          <Tag size={14} className="mr-1.5" />
                          Cat:{" "}
                          <strong className="ml-1 text-foreground">
                            {reg.category || "Não definida"}
                          </strong>
                        </div>

                        {/* Badge de Status Dinâmico */}
                        {reg.status?.toLowerCase() === "confirmado" ? (
                          <div className="flex items-center text-sm text-green-600 bg-green-500/10 px-2 py-1 rounded-md">
                            <CheckCircle size={14} className="mr-1.5" />
                            <strong className="capitalize">{reg.status}</strong>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                            <Clock size={14} className="mr-1.5" />
                            <strong className="capitalize">
                              {reg.status || "Pendente"}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
