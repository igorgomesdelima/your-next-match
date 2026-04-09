import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateTournament from "./pages/CreateTournament";
import BrowseTournaments from "./pages/BrowseTournaments";
import TournamentDetails from "./pages/TournamentDetails";
import ManageTournament from "./pages/ManageTournament";
import Profile from "./pages/Profile";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Componente para rotas que exigem login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Checa a sessão ao carregar a rota
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuta mudanças no estado de auth (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading)
    return (
      <div className="p-12 text-center text-primary font-bold">
        Carregando segurança...
      </div>
    );
  if (!session) return <Navigate to="/auth" />;
  return <>{children}</>;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Checa o usuário atual ao iniciar
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // 2. Configura o ouvinte global de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    // 3. Limpeza ao desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null; // Previne renderizar rotas antes de saber se está logado

  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Index />} />
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" /> : <Auth />}
        />
        <Route path="/browse" element={<BrowseTournaments />} />
        <Route path="/tournament/:id" element={<TournamentDetails />} />

        {/* Rotas Privadas (Exigem Login) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateTournament />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/:id"
          element={
            <ProtectedRoute>
              <ManageTournament />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
