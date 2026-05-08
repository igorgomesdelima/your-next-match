import { useState, useEffect } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

const faqs = [
  {
    question: "Como os jogadores pagam a inscrição?",
    answer:
      "A plataforma gerencia o status, mas o pagamento é feito via PIX diretamente para a chave do organizador. Você aprova com um clique no painel.",
  },
  {
    question: "Os jogadores precisam baixar um aplicativo?",
    answer:
      "Não! O MatchUp funciona direto no navegador do celular ou computador, de forma leve e super rápida.",
  },
  {
    question: "Posso criar torneios para qualquer esporte?",
    answer:
      "Sim! O sistema é otimizado para esportes de raquete e peteca, mas as chaves funcionam para qualquer competição de eliminação.",
  },
];

// O molde da nossa Avaliação vinda do Banco
interface Review {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

const TestimonialsSection = () => {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Estados do Banco e Usuário
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Estados do Modal de Avaliação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Puxa as avaliações e checa se o usuário está logado ao carregar a página
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("platform_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setReviews(data);
  };

  // 2. Lógica do Botão de Avaliar
  const handleOpenModal = () => {
    if (!currentUser) {
      toast({
        title: "Acesso Restrito",
        description:
          "Você precisa fazer login na plataforma para deixar uma avaliação.",
        variant: "destructive",
      });
      return;
    }
    setIsModalOpen(true);
  };

  // 3. Enviar a Avaliação pro Banco de Dados
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newRole.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      // Busca o nome do usuário na tabela de perfis
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", currentUser.id)
        .single();

      const userName =
        (profileData as { full_name?: string })?.full_name || "Usuário MatchUp";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("platform_reviews")
        .insert({
          user_id: currentUser.id,
          name: userName,
          role: newRole,
          text: newText,
          rating: newRating,
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Sua avaliação foi publicada e já está no ar.",
      });
      setIsModalOpen(false);
      setNewText("");
      setNewRole("");
      setNewRating(5);
      fetchReviews(); // Atualiza a lista na hora

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lógica do Carrossel
  const showArrows = reviews.length > 2;
  const nextReview = () => {
    if (currentReviewIndex < reviews.length - 2)
      setCurrentReviewIndex((prev) => prev + 1);
  };
  const prevReview = () => {
    if (currentReviewIndex > 0) setCurrentReviewIndex((prev) => prev - 1);
  };

  return (
    <section id="faq-reviews" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* LADO ESQUERDO: FAQ */}
          <div>
            <h2 className="text-3xl font-extrabold text-foreground mb-2">
              Dúvidas <span className="text-gradient-primary">Frequentes</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Tudo o que você precisa saber antes de criar seu primeiro torneio.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border border-border rounded-xl overflow-hidden transition-all duration-300 ${openFaq === index ? "bg-card shadow-sm" : "bg-transparent"}`}
                >
                  <button
                    className="w-full text-left px-6 py-4 font-bold flex justify-between items-center"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    {faq.question}
                    <span className="text-primary text-xl font-light">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-muted-foreground text-sm animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* LADO DIREITO: AVALIAÇÕES */}
          <div className="flex flex-col">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-foreground mb-2">
                  O que dizem os{" "}
                  <span className="text-gradient-primary">Jogadores</span>
                </h2>
                <p className="text-muted-foreground">
                  A opinião de quem já usa o MatchUp.
                </p>
              </div>
              <Button
                onClick={handleOpenModal}
                variant="outline"
                className="gap-2 border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black hidden sm:flex"
              >
                <MessageSquarePlus size={18} />
                Avaliar
              </Button>
            </div>

            {/* Lista de Avaliações */}
            <div className="relative flex-1">
              {reviews.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground min-h-[200px]">
                  <p className="mb-4">
                    Seja o primeiro a avaliar a nossa plataforma!
                  </p>
                  <Button
                    onClick={handleOpenModal}
                    className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/80 sm:hidden"
                  >
                    Avaliar Agora
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
                  {reviews
                    .slice(currentReviewIndex, currentReviewIndex + 2)
                    .map((review) => (
                      <div
                        key={review.id}
                        className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col animate-fade-in"
                      >
                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "text-[#FFD700] fill-[#FFD700]"
                                  : "text-muted"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-sm italic text-muted-foreground mb-4 flex-1">
                          "{review.text}"
                        </p>
                        <div>
                          <p className="font-bold text-foreground text-sm">
                            {review.name}
                          </p>
                          <p className="text-xs text-primary">{review.role}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Setas do Carrossel */}
              {showArrows && (
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={prevReview}
                    disabled={currentReviewIndex === 0}
                    className="rounded-full w-10 h-10"
                  >
                    <ChevronLeft size={18} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={nextReview}
                    disabled={currentReviewIndex >= reviews.length - 2}
                    className="rounded-full w-10 h-10"
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
              )}
            </div>

            {/* Botão Mobile */}
            {reviews.length > 0 && (
              <Button
                onClick={handleOpenModal}
                variant="outline"
                className="mt-6 gap-2 border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black sm:hidden w-full"
              >
                <MessageSquarePlus size={18} />
                Deixe sua avaliação
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================
          MODAL DE AVALIAÇÃO FLUTUANTE
          ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="font-bold text-xl">Deixe sua Avaliação</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
              {/* Estrelas */}
              <div>
                <label className="block text-sm font-bold mb-2">Sua Nota</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      className={`cursor-pointer transition-colors ${star <= newRating ? "text-[#FFD700] fill-[#FFD700]" : "text-muted-foreground hover:text-[#FFD700]"}`}
                      onClick={() => setNewRating(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Título / Cargo */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Sua Relação com o Esporte
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jogador de Tênis, Organizador de Peteca..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                />
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Seu Comentário
                </label>
                <textarea
                  rows={4}
                  placeholder="Conte-nos o que você achou do MatchUp..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] resize-none"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  required
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-black font-bold"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
