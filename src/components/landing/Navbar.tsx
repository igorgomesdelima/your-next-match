import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User as UserIcon, LogIn } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import logo from "@/assets/matchup-logo.png";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Checa o login assim que a Navbar carrega
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 bg-[#0000FF]"
            style={{
              WebkitMaskImage: `url(${logo})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: `url(${logo})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
          <span className="text-xl font-extrabold text-white">
            <span className="text-[#00CED1]">Match</span>
            <span className="text-[#FFD700]">Up</span>
          </span>
        </Link>

        {/* LINKS CENTRAIS (Opcional, se você quiser manter) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#features" className="hover:text-white transition-colors">
            Funcionalidades
          </a>
          <a href="#sports" className="hover:text-white transition-colors">
            Esportes
          </a>
        </div>

        {/* BOTÕES DA DIREITA */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white font-bold">
                <UserIcon size={16} className="mr-2" /> Meu Painel
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  Entrar
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-[#0000FF] hover:bg-[#0000FF]/90 text-white font-bold">
                  Criar Torneio
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
