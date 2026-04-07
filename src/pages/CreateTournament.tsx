import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trophy } from "lucide-react";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/matchup-logo.png";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateTournament = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // 1. Criamos os 'States' para guardar o que o usuário digita
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  // 2. Criamos a função que envia os dados para o banco
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Você precisa estar logado!");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from("tournaments").insert([
        {
          name: name,
          sport: sport,
          date: date,
          categories: category,
          price: Number(price) || 0,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Seu torneio foi criado e salvo no banco de dados.",
      });

      navigate("/dashboard"); // Manda o usuário para o painel
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        variant: "destructive",
        title: "Erro ao criar torneio",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="MatchUp" width={28} height={28} />
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Match<span className="text-gradient-primary">Up</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Trophy className="text-primary-foreground" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Criar Torneio
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure sua competição em minutos
            </p>
          </div>
        </div>

        {/* 3. Trocamos a tag <form> simples por uma que aciona a função no 'onSubmit' */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h3 className="font-bold text-foreground">Informações Básicas</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Torneio *</Label>
              {/* 4. Conectamos o Input com a variável 'name' */}
              <Input
                id="name"
                placeholder="Ex: Summer Slam 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Esporte *</Label>
                {/* 5. Conectamos o Select com a variável 'sport' */}
                <Select onValueChange={setSport} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tennis">Tênis</SelectItem>
                    <SelectItem value="beach-tennis">Beach Tennis</SelectItem>
                    <SelectItem value="padel">Padel</SelectItem>
                    <SelectItem value="squash">Squash</SelectItem>
                    <SelectItem value="peteca">Peteca</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato (Visual)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Eliminatória Simples</SelectItem>
                    <SelectItem value="groups">Fase de Grupos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Data de Início *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Iniciante">Iniciante</SelectItem>
                    <SelectItem value="C">Classe C</SelectItem>
                    <SelectItem value="B">Classe B</SelectItem>
                    <SelectItem value="A">Classe A</SelectItem>
                    <SelectItem value="PRO">PRO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h3 className="font-bold text-foreground">Detalhes</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-players">Máx. Participantes (Visual)</Label>
                <Input id="max-players" type="number" placeholder="16" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Valor da Inscrição (R$) *</Label>
                <Input
                  id="fee"
                  type="number"
                  placeholder="Ex: 50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prizes">Premiação (Visual)</Label>
              <Textarea
                id="prizes"
                placeholder="Troféu para o 1º lugar..."
                rows={2}
              />
            </div>
          </div>

          {/* 6. Transformamos o botão em type="submit" para ele acionar o form */}
          <Button
            variant="hero"
            className="w-full h-14 text-base bg-[#0000FF] hover:bg-[#0000FF]/90 text-white"
            type="submit"
            disabled={loading}
          >
            <Trophy size={20} className="mr-2" />
            {loading ? "Criando..." : "Criar Torneio"}
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreateTournament;
