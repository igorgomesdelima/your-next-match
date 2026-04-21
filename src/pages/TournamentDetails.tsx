import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  CheckCircle,
  FileText,
  User,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/matchup-logo.png";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Tournament {
  id: string;
  name: string;
  date: string;
  end_date?: string;
  sport: string;
  categories: string;
  price: number;
  rules?: string;
}

// Molde completo do participante trazendo o nome do perfil
interface Participant {
  id: string;
  user_id: string;
  category: string;
  profiles: {
    full_name: string | null;
  } | null;
}

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // 1. Pega o usuário logado para arrumar o Cabeçalho e checar inscrição
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        // 2. Busca os detalhes do torneio
        const { data: tourneyData, error: tourneyError } = await supabase
          .from("tournaments")
          .select("*")
          .eq("id", id)
          .single();

        if (tourneyError) throw tourneyError;
        setTournament(tourneyData as unknown as Tournament);

        // 3. Busca TODOS os inscritos para listar na tela
        const { data: participantsData, error: partError } = await supabase
          .from("participants")
          .select(`id, user_id, category, profiles(full_name)`)
          .eq("tournament_id", id);

        if (!partError && participantsData) {
          setParticipants(participantsData as unknown as Participant[]);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const handleRegister = async () => {
    if (!selectedCategory) {
      toast({
        variant: "destructive",
        title: "Atenção",
        description: "Selecione uma categoria.",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Login necessário",
        description: "Faça login para se inscrever.",
      });
      navigate("/auth");
      return;
    }

    setIsRegistering(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from("participants").insert([
        {
          tournament_id: id,
          user_id: currentUser.id,
          category: selectedCategory,
        },
      ]);

      if (error) {
        if (error.code === "23505") throw new Error(`Você já está inscrito!`);
        throw error;
      }

      toast({
        title: "Inscrição Confirmada! 🎉",
        description: `Vaga garantida na categoria ${selectedCategory}.`,
      });

      // Recarrega a página para atualizar a lista de inscritos
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao realizar inscrição.";
      toast({
        variant: "destructive",
        title: "Ops!",
        description: errorMessage,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading)
    return (
      <div className="p-12 text-center text-[#0000FF] font-bold">
        Carregando informações do torneio...
      </div>
    );
  if (!tournament)
    return (
      <div className="p-12 text-center text-red-500">
        Torneio não encontrado.
      </div>
    );

  const categoryList = tournament.categories
    .split(",")
    .map((cat) => cat.trim());

  // Lógica inteligente: Verifica se o usuário logado está na lista de participantes
  const userParticipation = participants.find(
    (p) => p.user_id === currentUser?.id,
  );
  const hasRegistered = !!userParticipation;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* CABEÇALHO INTELIGENTE */}
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

          <div className="flex gap-4 items-center">
            <Link to="/browse">
              <Button variant="ghost" size="sm">
                Explorar
              </Button>
            </Link>
            {currentUser ? (
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#0000FF] border-[#0000FF]"
                >
                  <User size={16} className="mr-2" /> Meu Painel
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} /> Voltar para Explorar
        </Link>

        {/* HERO SECTION */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm mb-8">
          <div className="h-32 md:h-48 bg-[#0000FF] relative flex items-end p-6 md:p-8">
            <div className="absolute top-4 right-4 bg-background/90 text-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              {tournament.sport.replace("-", " ")}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              {tournament.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUNA ESQUERDA: INFORMAÇÕES (Estilo LetzPlay) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bloco 1: Infos Básicas - ATUALIZADO COM DATA DE FIM */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-bold mb-4 border-b border-border pb-2 flex items-center gap-2">
                <FileText size={20} className="text-[#0000FF]" /> Informações
                Gerais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* AQUI ESTÁ A MUDANÇA: PERÍODO DO TORNEIO */}
                <div className="flex items-start gap-3">
                  <Calendar className="text-muted-foreground mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Período do Torneio
                    </p>
                    <p className="font-bold text-foreground">
                      {new Date(tournament.date).toLocaleDateString("pt-BR")}
                      {tournament.end_date &&
                        ` até ${new Date(tournament.end_date).toLocaleDateString("pt-BR")}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Local</p>
                    <p className="font-bold text-foreground">A definir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Classes e Inscritos (A Mágica acontece aqui!) */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-bold mb-4 border-b border-border pb-2 flex items-center gap-2">
                <Trophy size={20} className="text-[#FFD700]" /> Categorias
                Disponíveis
              </h3>
              <div className="space-y-3">
                {categoryList.map((cat, i) => {
                  const count = participants.filter(
                    (p) => p.category === cat,
                  ).length;
                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 hover:bg-secondary/50 rounded-lg border border-transparent hover:border-border transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0000FF]/10 flex items-center justify-center font-bold text-[#0000FF]">
                          {cat.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground">
                          Classe {cat}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-foreground">
                          {count}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Inscritos
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bloco 3: Lista de Jogadores */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-bold mb-4 border-b border-border pb-2 flex items-center gap-2">
                <Users size={20} className="text-[#00CED1]" /> Jogadores
                Confirmados
              </h3>
              {participants.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">
                  Ninguém se inscreveu ainda. Seja o primeiro!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User size={14} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground line-clamp-1">
                          {p.profiles?.full_name || "Jogador Anônimo"}
                        </p>
                        <p className="text-xs text-[#FFD700] font-semibold">
                          Cat: {p.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Bloco 4: Regulamento do Torneio */}
            <div className="bg-card p-6 rounded-xl border border-border mt-8">
              <h3 className="text-lg font-bold mb-4 border-b border-border pb-2 flex items-center gap-2">
                <BookOpen size={20} className="text-[#FF8C00]" /> Regulamento
                Oficial
              </h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {tournament.rules ||
                  "O organizador ainda não definiu as regras deste torneio."}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: AÇÃO DE INSCRIÇÃO E PAGAMENTO */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-20 shadow-sm">
              <p className="text-sm text-muted-foreground text-center mb-2">
                Valor da Inscrição
              </p>
              <h2 className="text-4xl font-extrabold text-center text-[#0000FF] mb-6">
                R$ {tournament.price}
              </h2>

              {hasRegistered ? (
                // SE JÁ TIVER INSCRITO -> MOSTRA INSCRIÇÃO + STATUS DE PAGAMENTO
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                    <CheckCircle
                      className="mx-auto text-green-500 mb-2"
                      size={24}
                    />
                    <h3 className="font-bold text-foreground">
                      Inscrição Reservada!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Categoria:{" "}
                      <strong className="text-green-600">
                        {userParticipation?.category}
                      </strong>
                    </p>
                  </div>

                  {/* Bloco de Pagamento Pendente */}
                  <div className="bg-gray-800 border border-border rounded-xl p-4 text-center">
                    <p className="text-sm font-bold text-[#FF8C00] mb-2">
                      Pagamento Pendente
                    </p>
                    {/* 👇 Agora o texto é BRANCO e visível 👇 */}
                    <p className="text-xs text-white mb-4">
                      Efetue o pagamento até o prazo limite para confirmar seu
                      nome no sorteio das chaves.
                    </p>
                    <Button className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white font-bold shadow-sm">
                      Efetuar Pagamento
                    </Button>
                  </div>
                </div>
              ) : (
                // SE NÃO TIVER INSCRITO -> MOSTRA O FORMULÁRIO DE CATEGORIA
                <>
                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-bold text-foreground block">
                      Escolha sua Categoria:
                    </label>
                    <Select onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryList.map((cat, i) => (
                          <SelectItem key={i} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="w-full h-12 bg-[#0000FF] hover:bg-[#0000FF]/90 text-white text-base font-bold shadow-sm"
                  >
                    <Trophy size={18} className="mr-2" />
                    {isRegistering ? "Processando..." : "Garantir Minha Vaga"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TournamentDetails;
