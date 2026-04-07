import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Começamos como 'null' para saber que ainda está carregando a informação
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Verifica se já existe uma sessão ativa assim que a página carrega
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // 2. Fica "escutando" mudanças (caso o usuário faça login ou logout em outra aba)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Limpeza do listener quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  // Enquanto estiver perguntando pro Supabase se o usuário existe, mostra um loading para não piscar a tela
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-[#00CED1]">
        Verificando acesso...
      </div>
    );
  }

  // Se o Supabase responder que não tem sessão, expulsa pro Login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Se tiver logado, libera o acesso à tela!
  return <>{children}</>;
};
