import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  { label: "Mon pitch parfait", prompt: "Aide-moi à créer un pitch parfait pour me présenter à un prospect" },
  { label: "Relance efficace", prompt: "Comment relancer un prospect qui n'a pas répondu à mon premier message ?" },
  { label: "Fixer mon tarif", prompt: "Comment fixer mes tarifs en freelance pour être compétitif tout en étant rentable ?" },
  { label: "Closer le deal", prompt: "Donne-moi des techniques pour closer un deal avec un prospect hésitant" },
];

const coachResponses: Record<string, string> = {
  pitch: `Voici un pitch en 3 étapes qui fonctionne très bien :\n\n**1. Accroche** : "Je travaille avec des entreprises comme la vôtre pour [résultat concret]"\n\n**2. Preuve** : "Par exemple, j'ai aidé [type d'entreprise] à [résultat mesurable]"\n\n**3. CTA** : "Seriez-vous disponible 15 minutes cette semaine pour en discuter ?"\n\n💡 **Astuce** : Personnalise toujours avec un détail spécifique sur l'entreprise du prospect.`,
  relance: `La relance est un art ! Voici ma méthode en 3 temps :\n\n**J+3** : Relance douce — "Je me permets de revenir vers vous suite à mon message de lundi..."\n\n**J+7** : Apport de valeur — Partage un article ou un conseil utile lié à leur secteur\n\n**J+14** : Dernière relance — "Je ne voudrais pas être insistant, mais je suis convaincu que [bénéfice]. C'est ma dernière relance !"\n\n📊 **Stat** : 80% des deals se concluent après la 5e relance. La plupart des freelancers abandonnent après la 1ère.`,
  tarif: `Voici comment calculer ton tarif idéal :\n\n**1. Coût de la vie** : Calcule tes charges mensuelles\n\n**2. Jours facturables** : En moyenne 15-18 jours/mois\n\n**3. Marge** : Ajoute 30% pour les imprévus et la croissance\n\n**Formule** : (Charges × 1.3) ÷ Jours facturables = TJM minimum\n\n💰 **Conseil** : Ne baisse jamais ton tarif. Propose plutôt un périmètre réduit si le budget est serré.\n\nPour le marché béninois, un bon TJM pour un dev web intermédiaire se situe entre 50 000 et 100 000 FCFA.`,
  closer: `Voici 4 techniques de closing efficaces :\n\n**1. Le résumé** : Récapitule les besoins du prospect et montre comment tu y réponds point par point\n\n**2. L'urgence naturelle** : "J'ai une disponibilité qui se libère la semaine prochaine, après je suis booké jusqu'au mois prochain"\n\n**3. Le risque inversé** : "On commence par un petit test de 3 jours. Si ça ne vous convient pas, vous ne payez rien"\n\n**4. Le silence** : Après avoir annoncé ton tarif, ne dis plus rien. Laisse le prospect réfléchir.\n\n🎯 **Règle d'or** : Ne vends jamais un service, vends un résultat.`,
  default: `Excellente question ! En tant que coach spécialisé en acquisition freelance, voici mon conseil :\n\n1. **Analyse** ton prospect avant de le contacter\n2. **Personnalise** chaque approche\n3. **Apporte de la valeur** avant de demander quoi que ce soit\n4. **Suis un processus** plutôt que d'improviser\n\nVeux-tu que j'approfondisse un de ces points ? 😊`,
};

const getResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes("pitch")) return coachResponses.pitch;
  if (lower.includes("relance")) return coachResponses.relance;
  if (lower.includes("tarif") || lower.includes("prix")) return coachResponses.tarif;
  if (lower.includes("closer") || lower.includes("deal") || lower.includes("hésitant")) return coachResponses.closer;
  return coachResponses.default;
};

const Coach = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Salut ! 👋 Je suis ton coach IA spécialisé en acquisition freelance. Pose-moi n'importe quelle question sur la prospection, le closing, les tarifs... Je suis là pour t'aider à décrocher tes prochains clients !",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <DashboardLayout hideDashboard onBack={() => navigate("/prospects")}>
        <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-4xl flex-col pt-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight">Coach IA</h1>
            <p className="mt-1 text-sm text-slate-400 font-medium">
              Ton expert en acquisition et closing freelance personnel
            </p>
          </div>

          {/* Quick Actions - Glacial Style */}
          <div className="mb-4 md:mb-6 grid grid-cols-2 gap-2 md:gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                onClick={() => sendMessage(action.prompt)}
                className="bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl h-9 md:h-9 text-xs md:text-xs transition-all font-bold backdrop-blur-md w-full justify-start truncate"
              >
                <Sparkles className="mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5 text-[#6366F1] shrink-0" />
                <span className="truncate">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Chat Container - Glacial Style */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-auto rounded-[2.5rem] border border-white/10 bg-white/5 p-8 space-y-6 backdrop-blur-md shadow-2xl shadow-black/40 mb-6 scrollbar-thin scrollbar-thumb-white/10"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-indigo-500/10 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white"
                      : "bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div
                  className={`max-w-[85%] rounded-[2rem] px-6 py-4 text-[15px] leading-relaxed font-medium shadow-sm transition-all ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-tr-none"
                      : "bg-white/10 text-slate-200 border border-white/5 rounded-tl-none backdrop-blur-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-[2rem] bg-white/10 px-6 py-4 border border-white/5 backdrop-blur-sm rounded-tl-none">
                  <div className="flex gap-1.5 p-1">
                    <span className="h-2 w-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pb-8">
            <div className="flex gap-3 p-1.5 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-xl shadow-black/20 focus-within:border-[#6366F1]/50 transition-all items-center">
              <input
                placeholder="Pose ta question en closing ou prospection..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder:text-slate-500 h-10 px-6"
              />
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/20 border-0 flex-shrink-0 hover:scale-105 active:scale-95 transition-all p-0 mr-0.5"
              >
                <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Coach;
