import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [favoriteSport, setFavoriteSport] = useState("");

  // 1. Busca os dados atuais do usuário assim que a página carrega
  useEffect(() => {
    const getProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
          setFavoriteSport(data.favorite_sport || "");
        }
      } catch (error) {
        console.log(
          "Perfil ainda não existe, será criado no primeiro salvamento.",
        );
      } finally {
        setFetching(false);
      }
    };

    getProfile();
  }, []);

  // 2. Salva (ou atualiza) os dados no banco
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // UPSERT é um comando mágico do banco: Se não existe, ele cria (Insert). Se existe, ele atualiza (Update).
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from("profiles").upsert({
        id: userId,
        full_name: fullName,
        phone: phone,
        favorite_sport: favoriteSport,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Perfil salvo!",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      // Verificamos de forma segura se o erro tem uma mensagem
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido ao salvar.";

      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="p-12 text-center text-[#00CED1]">
        Carregando perfil...
      </div>
    );

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8 max-w-2xl">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Voltar ao Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#0000FF]/10 flex items-center justify-center border border-[#0000FF]/20">
          <User className="text-[#0000FF]" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Suas informações de jogador e organizador.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-card p-6 rounded-xl border border-border space-y-6 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input
            id="fullName"
            placeholder="Ex: Rafael Nadal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (WhatsApp)</Label>
            <Input
              id="phone"
              placeholder="(00) 90000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport">Esporte Principal</Label>
            <Input
              id="sport"
              placeholder="Ex: Beach Tennis"
              value={favoriteSport}
              onChange={(e) => setFavoriteSport(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-[#0000FF] hover:bg-[#0000FF]/90 text-white"
        >
          <Save size={18} className="mr-2" />
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
