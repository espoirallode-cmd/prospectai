import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Zap, 
  Home, 
  Bot, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Rocket, 
  Search, 
  MessageSquare, 
  UserPlus,
  Send,
  Sparkles,
  User as UserIcon,
  MapPin,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SettingsView from "@/components/SettingsView";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"accueil" | "coach" | "settings" | "prospects">("accueil");
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  // Handle URL view parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    if (view === "prospects" || view === "coach" || view === "settings") {
      setCurrentView(view as any);
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);
  const [user, setUser] = useState({ firstName: "Freelance", lastName: "", email: "", photo: null as string | null });
  
  // Coach State
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Salut ! 👋 Je suis ton coach IA spécialisé en acquisition freelance. Pose-moi n'importe quelle question sur la prospection, le closing, les tarifs... Je suis là pour t'aider à décrocher tes prochains clients !",
    },
  ]);
  const [coachInput, setCoachInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstName = localStorage.getItem("user_firstName");
    const lastName = localStorage.getItem("user_lastName");
    const email = localStorage.getItem("user_email");
    const photo = localStorage.getItem("user_photo");
    if (firstName) {
      setUser({ firstName, lastName: lastName || "", email: email || "", photo });
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView === "coach") {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, currentView]);

  const handleLogout = () => {
    const toastId = toast.loading("Déconnexion en cours...");
    
    // Clear all user data
    localStorage.removeItem("user_firstName");
    localStorage.removeItem("user_lastName");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_photo");
    localStorage.removeItem("user_notifications");
    localStorage.removeItem("user_skills");

    setTimeout(() => {
      toast.success("Vous avez été déconnecté", { id: toastId });
      navigate("/");
    }, 1200);
  };

  const getInitials = () => {
    return (user.firstName[0] + (user.lastName[0] || "")).toUpperCase();
  };

  const sendCoachMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setCoachInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const getViewTitle = () => {
    switch(currentView) {
      case "coach": return "Coach IA";
      case "settings": return "Paramètres";
      default: return "Accueil";
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Sidebar - PC Only */}
      <aside className="hidden md:flex w-64 bg-[#1a0533] flex-col border-r border-white/5">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">ProspectAI</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <button 
            onClick={() => setCurrentView("accueil")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === "accueil" ? "bg-[#6366F1]/10 text-[#6366F1] font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Accueil</span>
          </button>
          
          <button 
            onClick={() => setCurrentView("coach")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === "coach" ? "bg-[#6366F1]/10 text-[#6366F1] font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Bot className="h-5 w-5" />
            <span>Coach IA</span>
          </button>
          
          <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <HelpCircle className="h-5 w-5" />
            <span>Assistance</span>
          </Link>
          
          <button 
            onClick={() => setCurrentView("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === "settings" ? "bg-[#6366F1]/10 text-[#6366F1] font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Paramètres</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#0a0a0f] border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30">
          <button 
            onClick={() => setCurrentView("accueil")}
            className="hidden md:flex items-center gap-2 text-white/40 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">/ {getViewTitle()}</span>
          </button>
          
          {/* Mobile Logo */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">ProspectAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* PC Profile view */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-xs font-bold ring-2 ring-white/10 overflow-hidden">
                  {user.photo ? (
                    <img src={user.photo} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    getInitials()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none mb-1">{user.firstName} {user.lastName}</span>
                  <span className="text-[10px] text-white/40 leading-none">{user.email}</span>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </button>
            </div>

            {/* Mobile Profile Avartar Toggle */}
            <div className="md:hidden relative">
              <button 
                onClick={() => setShowMobileProfile(!showMobileProfile)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-[10px] font-bold ring-2 ring-white/10 overflow-hidden focus:outline-none"
              >
                {user.photo ? (
                  <img src={user.photo} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  getInitials()
                )}
              </button>
              
              {/* Dropdown Menu Mobile */}
              {showMobileProfile && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMobileProfile(false)} />
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-xl border border-white/10 bg-[#1a0533] p-2 shadow-2xl z-50 animate-fade-in-up">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs text-white/50 break-words">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Switcher */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {currentView === "accueil" && (
            <div className="min-h-full p-6 md:p-12 flex flex-col items-center justify-center text-center">
              <div className="max-w-3xl animate-fade-in mt-10 md:mt-0">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 tracking-tight">
                  Bonjour {user.firstName} {user.lastName} ! 👋
                </h1>
                <p className="text-sm md:text-xl text-white/50 mb-8 md:mb-12 font-medium">
                  Prêt à trouver tes premiers clients freelance aujourd'hui ?
                </p>

                <Link to="/onboarding">
                  <Button 
                    size="lg" 
                    className="h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:scale-105 transition-all duration-300 font-bold text-sm md:text-lg shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)] md:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] border-0 whitespace-normal h-auto py-3 md:py-0"
                  >
                    <Rocket className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 shrink-0" />
                    <span className="leading-tight">Commencer ma recherche de prospects</span>
                  </Button>
                </Link>

                <div className="grid grid-cols-2 gap-4 md:gap-6 mt-16 md:mt-20 w-full max-w-xl mx-auto">
                  {[
                    { label: "Messages générés", value: "0", icon: MessageSquare },
                    { label: "Clients contactés", value: "0", icon: UserPlus },
                  ].map((stat, i) => (
                    <div 
                      key={i} 
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex justify-center mb-2 md:mb-3">
                        <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-[#6366F1] group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="text-lg md:text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === "prospects" && (
            <div className="p-8 max-w-6xl mx-auto animate-fade-in">
              <header className="mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    Opportunités <Sparkles className="text-yellow-400 h-6 w-6" />
                  </h1>
                  <p className="text-white/40 mt-1">Prospects détectés par notre IA dans votre zone</p>
                </div>
                <Badge className="bg-[#6366F1]/20 text-[#6366F1] border-[#6366F1]/30 px-4 py-2 rounded-xl mb-1">
                  12 Nouveaux détectés
                </Badge>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {[
                  { name: "Hôtel Salam", sector: "Hôtellerie", city: "Bamako", score: 94, need: "Refonte site web + Booking engine", budget: "500k - 1.2M FCFA" },
                  { name: "Cabinet Médical Atlas", sector: "Santé", city: "Cotonou", score: 88, need: "Gestion de réseaux sociaux", budget: "200k - 450k FCFA" },
                  { name: "Boutique Oasis", sector: "Commerce", city: "Abidjan", score: 82, need: "Création application mobile", budget: "1.5M - 3M FCFA" },
                  { name: "Restaurant Le Gourmet", sector: "Restauration", city: "Dakar", score: 79, need: "SEO local & Google Maps", budget: "150k - 300k FCFA" },
                ].map((p, i) => (
                  <div key={i} className="bg-[#1a1a2e] rounded-3xl border border-white/5 p-6 hover:border-[#6366F1]/40 transition-all group hover:shadow-2xl hover:shadow-indigo-500/10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#6366F1] transition-colors">{p.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                          <span>{p.sector}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.city}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-2xl font-black text-[#6366F1]">{p.score}%</div>
                        <div className="text-[10px] text-white/30 uppercase tracking-tighter">Match Score</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xs text-white/40 mb-1 font-bold uppercase tracking-wider">Besoin détecté</p>
                        <p className="text-sm text-white/90 font-medium">{p.need}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <CreditCard className="h-4 w-4 text-green-500" />
                          <span>{p.budget}</span>
                        </div>
                        <Button size="sm" className="bg-[#6366F1] hover:bg-[#8B5CF6] text-white rounded-xl text-xs px-4 h-9 font-bold transition-all transform group-hover:scale-105">
                          Voir l'opportunité
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === "coach" && (
            <div className="h-full p-4 md:p-8 flex flex-col max-w-4xl mx-auto animate-fade-in">
              <div className="flex-1 flex flex-col overflow-hidden bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 p-4 md:p-6">
                <div className="mb-4 md:mb-6">
                  <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2">
                    <Bot className="text-[#6366F1] h-5 w-5 md:h-6 md:w-6" /> Coach IA Privé
                  </h2>
                  <p className="text-white/40 text-xs md:text-sm">Pose tes questions avant de lancer ta recherche</p>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 md:mb-6 custom-scrollbar" ref={scrollRef}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 md:gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl md:rounded-2xl ${
                        msg.role === "assistant" ? "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]" : "bg-white/10"
                      }`}>
                        {msg.role === "assistant" ? <Bot className="h-4 w-4 md:h-5 md:w-5" /> : <UserIcon className="h-4 w-4 md:h-5 md:w-5" />}
                      </div>
                      <div className={`max-w-[85%] md:max-w-[75%] px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl text-[13px] md:text-sm leading-relaxed ${
                        msg.role === "user" ? "bg-[#6366F1] text-white" : "bg-white/10 text-white/90"
                      }`}>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 md:gap-4">
                      <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]">
                        <Bot className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="bg-white/10 px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl">
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "200ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "400ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => sendCoachMessage(action.prompt)}
                      className="whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/5 bg-white/5 text-[10px] md:text-xs text-white/60 hover:text-white hover:bg-[#6366F1]/20 hover:border-[#6366F1]/50 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="h-2.5 w-2.5 md:h-3 md:w-3 text-[#6366F1]" />
                      {action.label}
                    </button>
                  ))}
                </div>

                <div className="flex shrink-0">
                  <div className="flex-1 relative group">
                    <Input
                      placeholder="Comment trouver mes premiers clients ?"
                      value={coachInput}
                      onChange={(e) => setCoachInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendCoachMessage(coachInput)}
                      className="h-12 md:h-14 bg-white/5 border-white/10 rounded-xl md:rounded-2xl pl-4 md:pl-6 pr-12 md:pr-14 focus:ring-[#6366F1]/30 transition-all text-white placeholder:text-[10px] md:placeholder:text-sm placeholder:text-white/20 text-xs md:text-sm"
                    />
                    <button 
                      onClick={() => sendCoachMessage(coachInput)}
                      className="absolute right-2 top-1.5 md:top-2 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-[#6366F1] text-white hover:opacity-90 transition-opacity disabled:opacity-30"
                      disabled={!coachInput.trim()}
                    >
                      <Send className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === "settings" && <SettingsView />}
        </main>

        {/* Bottom Navigation for Mobile */}
        <nav className="md:hidden flex items-center justify-around bg-[#1a0533] border-t border-white/5 pb-safe pt-2 px-2 shrink-0 h-[68px] z-50 sticky bottom-0">
          <button 
            onClick={() => setCurrentView("accueil")}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-full ${currentView === "accueil" ? "text-[#6366F1]" : "text-white/40 hover:text-white/80"}`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Accueil</span>
          </button>
          
          <button 
            onClick={() => setCurrentView("coach")}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-full ${currentView === "coach" ? "text-[#6366F1]" : "text-white/40 hover:text-white/80"}`}
          >
            <Bot className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Coach IA</span>
          </button>
          
          <Link 
            to="#"
            className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-full text-white/40 hover:text-white/80"
          >
            <HelpCircle className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Assistance</span>
          </Link>
          
          <button 
            onClick={() => setCurrentView("settings")}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-full ${currentView === "settings" ? "text-[#6366F1]" : "text-white/40 hover:text-white/80"}`}
          >
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Paramètres</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
