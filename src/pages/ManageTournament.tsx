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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Tournament {
  id: string;
  name: string;
  date: string;
  sport: string;
  categories: string;
  price: number;
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
  const [editPrice, setEditPrice] = useState("");
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
          setTournament(data);
          setEditName(data.name);
          setEditDate(data.date);
          setEditPrice(data.price.toString());
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
    setIsSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("tournaments")
        .update({
          name: editName,
          date: editDate,
          price: Number(editPrice),
        })
        .eq("id", id);

      if (error) throw error;

      if (tournament) {
        setTournament({
          ...tournament,
          name: editName,
          date: editDate,
          price: Number(editPrice),
        });
      }
      setIsEditing(false);

      toast({
        title: "Torneio Atualizado!",
        description: "As informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Verifique os dados e tente novamente.",
      });
    } finally {
      setIsSaving(false);
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex-1 w-full">
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-2xl font-bold h-12 w-full md:max-w-md border-[#0000FF]"
            />
          ) : (
            <h1 className="text-3xl font-extrabold tracking-tight">
              {tournament.name}
            </h1>
          )}
          <p className="text-muted-foreground mt-1">
            Painel de Administração do Torneio
          </p>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                <X size={16} className="mr-2" /> Cancelar
              </Button>
              <Button
                className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white"
                onClick={handleUpdate}
                disabled={isSaving}
              >
                <Save size={16} className="mr-2" />{" "}
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Settings size={16} className="mr-2" /> Editar Infos
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={16} className="mr-2" />{" "}
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </>
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
            <div className="space-y-4">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border rounded-lg bg-background hover:border-[#0000FF]/50 transition-colors gap-4"
                >
                  <div>
                    <p className="font-bold text-foreground">
                      {participant.profiles?.full_name || "Jogador Anônimo"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {participant.profiles?.phone || "Sem telefone cadastrado"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase font-bold">
                        Categoria
                      </p>
                      <p className="font-semibold text-[#FFD700]">
                        {participant.category}
                      </p>
                    </div>
                    <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <CheckCircle size={14} className="mr-1" /> Confirmado
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">
              Data de Início
            </p>
            {isEditing ? (
              <Input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="font-medium">
                {new Date(tournament.date).toLocaleDateString("pt-BR")}
              </p>
            )}
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
        </div>
      </div>
    </div>
  );
};

export default ManageTournament;
