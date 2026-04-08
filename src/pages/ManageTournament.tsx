import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ManageTournament = () => {
  const { id } = useParams(); // Pega o ID da URL
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("tournaments")
          .select("*")
          .eq("id", id)
          .single(); // Exige que traga apenas 1 resultado

        if (error) throw error;
        setTournament(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTournamentDetails();
  }, [id]);

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
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {tournament.name}
          </h1>
          <p className="text-muted-foreground">
            Painel de Administração do Torneio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings size={16} className="mr-2" /> Editar Infos
          </Button>
          <Button variant="destructive">
            <Trash2 size={16} className="mr-2" /> Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm md:col-span-2">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <Users size={18} className="mr-2 text-[#0000FF]" /> Inscrições
            Recebidas
          </h3>
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg text-muted-foreground">
            Ainda não há jogadores inscritos neste torneio.
            <br />
            (Em breve conectaremos a tabela de jogadores aqui!)
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
          <h3 className="font-bold text-lg border-b border-border pb-2">
            Resumo
          </h3>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">
              Esporte
            </p>
            <p className="font-medium">{tournament.sport}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">
              Data
            </p>
            <p className="font-medium">
              {new Date(tournament.date).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">
              Valor
            </p>
            <p className="font-medium text-[#FFD700]">R$ {tournament.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTournament;
