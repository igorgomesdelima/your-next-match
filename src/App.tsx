// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ManageTournament from "./pages/ManageTournament";

// Importações das páginas
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateTournament from "./pages/CreateTournament";
import BrowseTournaments from "./pages/BrowseTournaments";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth"; // <- Nova página de Login

// Importação do nosso Guarda-Costas
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas (Qualquer um acessa) */}
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<BrowseTournaments />} />
          <Route path="/auth" element={<Auth />} />

          {/* Rotas Protegidas (Precisa estar logado) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
            path="/create"
            element={
              <ProtectedRoute>
                <CreateTournament />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
