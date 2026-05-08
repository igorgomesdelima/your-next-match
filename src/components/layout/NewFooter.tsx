import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/matchup-logo.png"; // Usando sua logo se quiser imagem, mas deixei texto abaixo

const NewFooter = () => {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Coluna 1: Marca e Sobre */}
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#00E5FF]">Match</span>
              <span className="text-2xl font-black text-[#FFD700]">Up</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              A plataforma definitiva para organizar e gerenciar torneios de
              esportes de raquete. Feito por jogadores, para jogadores.
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#features"
                  className="hover:text-[#00E5FF] transition-colors"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <a
                  href="#sports"
                  className="hover:text-[#00E5FF] transition-colors"
                >
                  Esportes
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-[#00E5FF] transition-colors"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="/auth"
                  className="hover:text-[#00E5FF] transition-colors"
                >
                  Entrar / Cadastrar
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Fale Conosco</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3 hover:text-foreground transition-colors">
                <Phone size={16} className="text-[#00E5FF]" />
                {/* O número oficial que você me passou antes! */}
                <a
                  href="https://wa.me/5534996301409"
                  target="_blank"
                  rel="noreferrer"
                >
                  (34) 99630-1409
                </a>
              </li>
              <li className="flex items-center gap-3 hover:text-foreground transition-colors">
                <Mail size={16} className="text-[#00E5FF]" />
                <a href="mailto:contato@matchup.com.br">
                  contato@matchup.com.br
                </a>
              </li>
            </ul>

            {/* Redes Sociais */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/matchup.app"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-[#00E5FF] hover:text-black transition-all"
              >
                <Instagram size={10} />
              </a>
            </div>
          </div>
        </div>

        {/* Linha Inferior (Copyright) */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 MatchUp. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
