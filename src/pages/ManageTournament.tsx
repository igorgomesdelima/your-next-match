import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Settings,
  Trash2,
  CheckCircle,
  Save,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface Participant {
  id: string;
  category: string;
  status: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    phone: string | null;
  } | null;
}

const ManageTournament = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Garantimos explicitamente que este state aceita o tipo Tournament
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editRules, setEditRules] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        // Usamos o bypass na raiz para o TypeScript parar de forçar o tipo "never"
        const { data: tourneyData, error: tourneyError } = await supabase
          .from("tournaments")
          .select("*")
          .eq("id", id)
          .single();

        if (tourneyError) throw tourneyError;

        // Transformamos o dado puro no nosso formato
        const data = tourneyData as unknown as Tournament;

        if (data) {
          setTournament(data as unknown as Tournament);
          setEditName(data.name);

          // Função que "força" a data para o padrão rigoroso do HTML (AAAA-MM-DD)
          const forceValidDate = (dateString?: string | null) => {
            if (!dateString) return "";
            try {
              // Se já vier no formato exato (ex: 2026-04-18), a gente só recorta e manda
              if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
                return dateString.substring(0, 10);
              }
              // Se vier diferente, o Javascript converte e a gente formata
              const parsedDate = new Date(dateString);
              if (isNaN(parsedDate.getTime())) return ""; // Se for inválida, devolve vazio para não travar
              return parsedDate.toISOString().split("T")[0];
            } catch (error) {
              return "";
            }
          };

          // Agora usamos a função para blindar as datas
          setEditDate(forceValidDate(data.date));
          setEditEndDate(forceValidDate(data.end_date));

          setEditPrice(data.price?.toString() || "");
          setEditRules(data.rules || "");
        }

        const { data: participantsData, error: participantsError } =
          await supabase
            .from("participants")
            .select(
              `
            id,
            category,
            status,
            created_at,
            profiles (full_name, phone)
          `,
            )
            .eq("tournament_id", id)
            .order("created_at", { ascending: false });

        if (participantsError) throw participantsError;
        if (participantsData) {
          setParticipants(participantsData as unknown as Participant[]);
        }
      } catch (error) {
        console.error("Erro ao buscar painel do torneio:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTournamentData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      // O SEGREDO: Se a data estiver vazia, mandamos null em vez de string vazia ("")
      const formattedEndDate = editEndDate === "" ? null : editEndDate;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("tournaments")
        .update({
          name: editName,
          date: editDate,
          end_date: formattedEndDate, // <-- Usando a variável tratada
          price: Number(editPrice),
          rules: editRules,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTournament(data as unknown as Tournament);
        setIsEditing(false);
        toast({
          title: "Sucesso!",
          description: "Torneio atualizado com sucesso.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro completo ao salvar:", error);
      // Pega a mensagem real do Supabase
      const errorMessage =
        error?.message ||
        error?.details ||
        "Erro desconhecido. Aperte F12 e olhe o Console.";

      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: errorMessage,
      });
    }
  };

  const handleApprovePayment = async (participantId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("participants")
        .update({ status: "Confirmado" })
        .eq("id", participantId);

      if (error) throw error;

      // FORMATO CORRETO DO TOAST
      toast({
        title: "Pagamento Aprovado!",
        description: "O jogador agora está oficialmente confirmado.",
      });

      window.location.reload();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // FORMATO CORRETO DO TOAST DE ERRO
      toast({
        variant: "destructive",
        title: "Erro ao aprovar",
        description: error.message,
      });
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "TEM CERTEZA ABSOLUTA? \n\nIsso apagará o torneio e TODAS as inscrições feitas nele. Essa ação não pode ser desfeita.",
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("tournaments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Torneio Excluído",
        description: "O torneio e suas inscrições foram removidos.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao tentar apagar o torneio.",
      });
      setIsDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="p-12 text-center">Carregando painel de controle...</div>
    );
  if (!tournament)
    return (
      <div className="p-12 text-center text-red-500">
        Torneio não encontrado.
      </div>
    );

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft size={16} /> Voltar ao Dashboard
      </Link>

      {/* Substitua a área do Título e Botões por isto: */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
        <div className="w-full max-w-md">
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-lg font-bold w-full border-[#0000FF] focus-visible:ring-[#0000FF]"
            />
          ) : (
            <h1 className="text-2xl font-bold text-foreground">
              {tournament.name}
            </h1>
          )}
          <p className="text-muted-foreground mt-1">
            Painel de Administração do Torneio
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X size={16} className="mr-2" /> Cancelar
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white"
              >
                <Save size={16} className="mr-2" /> Salvar
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white"
            >
              Editar Infos
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center">
              <Users size={18} className="mr-2 text-[#0000FF]" />
              Inscrições Recebidas ({participants.length})
            </h3>
          </div>

          {participants.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg text-muted-foreground">
              Ainda não há jogadores inscritos neste torneio.
            </div>
          ) : (
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-fit">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users size={20} className="text-[#0000FF]" /> Inscrições
                Recebidas ({participants.length})
              </h3>

              <div className="space-y-3">
                {participants.length === 0 ? (
                  <p className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-8 text-center">
                    Nenhuma inscrição recebida ainda.
                  </p>
                ) : (
                  participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-border rounded-lg bg-background gap-4 hover:border-border/80 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-foreground">
                          {participant.profiles?.full_name || "Jogador Anônimo"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded text-muted-foreground uppercase">
                            CAT: {participant.category || "N/A"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {participant.profiles?.phone || "Sem telefone"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {participant.status === "Em Análise" ? (
                          <>
                            <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md flex items-center gap-1">
                              <Clock size={14} /> Em Análise
                            </span>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleApprovePayment(participant.id)
                              }
                              className="bg-green-600 hover:bg-green-700 text-white h-8"
                            >
                              <CheckCircle size={16} className="mr-1" /> Aprovar
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-green-600 bg-green-500/10 px-3 py-1.5 rounded-md flex items-center gap-1">
                            <CheckCircle size={16} />{" "}
                            {participant.status || "Confirmado"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* INÍCIO DO BLOCO RESUMO */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-lg border-b border-border pb-2">
            Resumo
          </h3>

          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">
              Esporte
            </p>
            <p className="font-medium capitalize">
              {tournament.sport.replace("-", " ")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full">
              <p className="text-xs text-muted-foreground uppercase font-bold">
                Início
              </p>
              {isEditing ? (
                <input
                  type="date"
                  value={editDate || ""}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0000FF]"
                />
              ) : (
                <p className="font-medium">
                  {new Date(tournament.date).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>

            <div className="w-full">
              <p className="text-xs text-muted-foreground uppercase font-bold">
                Término
              </p>
              {isEditing ? (
                <input
                  type="date"
                  value={editEndDate || ""}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0000FF]"
                />
              ) : (
                <p className="font-medium">
                  {tournament.end_date
                    ? new Date(tournament.end_date).toLocaleDateString("pt-BR")
                    : "Não definido"}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">
              Valor (R$)
            </p>
            {isEditing ? (
              <Input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="font-medium text-[#FFD700]">
                R$ {tournament.price}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-2">
              Regulamento
            </p>
            {isEditing ? (
              <textarea
                value={editRules}
                onChange={(e) => setEditRules(e.target.value)}
                className="w-full min-h-[150px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0000FF]"
                placeholder="Digite as regras do torneio, critérios de desempate, WO..."
              />
            ) : (
              <div className="text-sm text-foreground whitespace-pre-wrap">
                {tournament.rules || "Nenhum regulamento definido."}
              </div>
            )}
          </div>
        </div>
        {/* FIM DO BLOCO RESUMO */}
      </div>
    </div>
  );
};

export default ManageTournament;
