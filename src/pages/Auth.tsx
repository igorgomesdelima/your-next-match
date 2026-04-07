import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Controle de estado de carregamento

  const navigate = useNavigate();
  const { toast } = useToast(); // Hook para mostrar notificações na tela

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    setLoading(true);

    try {
      if (isLogin) {
        // Tentativa de Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Se deu certo, redireciona para o Dashboard
        navigate("/dashboard");
      } else {
        // Tentativa de Cadastro (Sign Up)
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Conta criada com sucesso!",
          description:
            "Verifique sua caixa de e-mail para confirmar o cadastro.",
        });
      }
    } catch (error) {
      // Verificamos se o erro é realmente um objeto do tipo Error padrão do JS
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";

      toast({
        variant: "destructive",
        title: "Erro na autenticação",
        description: errorMessage,
      });
    } finally {
      setLoading(false); // Libera o botão independente de dar certo ou errado
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-card border border-border/20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            <span className="text-[#00CED1]">Match</span>
            <span className="text-[#FFD700]">Up</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? "Entre na sua conta para continuar"
              : "Crie sua conta para organizar torneios"}
          </p>
        </div>

        <form className="space-y-4 mt-8" onSubmit={handleAuth}>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Seu e-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Atualiza a variável email
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Sua senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Atualiza a variável password
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0000FF] hover:bg-[#0000FF]/90 text-white"
            disabled={loading} // Desativa o botão enquanto carrega
          >
            {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-[#00CED1] hover:underline"
          >
            {isLogin
              ? "Não tem uma conta? Cadastre-se"
              : "Já tem uma conta? Faça login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
