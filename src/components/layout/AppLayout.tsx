import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Search, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Os links do nosso menu principal
  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Meu Painel" },
    { path: "/browse", icon: Search, label: "Explorar" },
    { path: "/create", icon: PlusCircle, label: "Criar Torneio" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card shadow-sm z-10">
        <div className="p-6 border-b border-border">
          <Link
            to="/"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            {/* Logo em formato de texto para não dar erro de imagem */}
            <span className="text-2xl font-black text-[#00E5FF]">Match</span>
            <span className="text-2xl font-black text-[#FFD700]">Up</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          <p className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Menu Principal
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#0000FF] text-white shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={20} />
                {/* Aqui está o texto que tinha sumido! */}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {/* Header Mobile */}
        <header className="md:hidden flex items-center justify-center p-4 border-b border-border bg-card sticky top-0 z-10">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-black text-[#00E5FF]">Match</span>
            <span className="text-xl font-black text-[#FFD700]">Up</span>
          </Link>
        </header>

        <div className="h-full">
          {/* O Outlet é onde as páginas (Dashboard, Explorar) são injetadas */}
          <Outlet />
        </div>
      </main>

      {/* BOTTOM NAV MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-2 pb-safe z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? "text-[#00E5FF]" : "text-muted-foreground"
              }`}
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AppLayout;
