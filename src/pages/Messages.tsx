import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prospects, Prospect, getUrgencyConfig, getUrgencyLevel } from "@/data/prospects";
import { Copy, RefreshCw, Mail, MessageCircle, Linkedin, Sparkles, Check } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

function generateMessages(prospect: Prospect, channel: string): { a: string; b: string } {
  const { name, signals, detectedNeed, sector, city, neighborhood } = prospect;
  const mainSignal = signals[0] || "un manque de visibilité en ligne";

  const problemPhrase = signals.includes("Pas de site web")
    ? `votre entreprise n'a pas encore de site web`
    : signals.includes("Site non mobile")
    ? `votre site n'est pas optimisé pour mobile`
    : signals.some((s) => s.includes("Note"))
    ? `votre note sur Google est en dessous de la moyenne du secteur`
    : signals.includes("Pas de réseaux sociaux")
    ? `votre entreprise n'est pas encore présente sur les réseaux sociaux`
    : `votre visibilité en ligne pourrait être améliorée`;

  const lossEstimate = signals.includes("Pas de site web")
    ? "Selon nos analyses, une entreprise sans site web perd en moyenne 35-50% de clients potentiels qui cherchent ses services en ligne."
    : signals.includes("Site non mobile")
    ? "Aujourd'hui, 70% des recherches se font sur mobile. Un site non responsive fait fuir en moyenne 60% des visiteurs."
    : signals.some((s) => s.includes("Note"))
    ? "Une note inférieure à 4/5 sur Google fait perdre jusqu'à 40% des clients potentiels qui comparent avant de choisir."
    : signals.includes("Pas de réseaux sociaux")
    ? "Sans présence sur les réseaux sociaux, vous passez à côté de 45% de votre audience cible qui découvre les entreprises via Instagram et Facebook."
    : "Un manque de visibilité digitale représente une perte estimée de 30% de clients potentiels.";

  if (channel === "email") {
    return {
      a: `Bonjour,\n\nJe suis freelance spécialisé dans le digital pour les entreprises du secteur ${sector} à ${city}.\n\nEn analysant votre activité, j'ai remarqué que ${problemPhrase}. ${lossEstimate}\n\nJe peux vous proposer une solution concrète : ${detectedNeed.toLowerCase()}, parfaitement adaptée à vos besoins actuels.\n\nRésultat attendu : une visibilité accrue et de nouveaux clients dès les premières semaines.\n\nSeriez-vous disponible pour un appel de 15 min cette semaine ?\n\nCordialement`,
      b: `Bonjour,\n\nJe me permets de vous contacter car je travaille avec plusieurs entreprises de ${neighborhood}, ${city}.\n\nJ'ai constaté que ${problemPhrase} — c'est un signal important car ${lossEstimate.toLowerCase()}\n\nMa proposition : ${detectedNeed.toLowerCase()}, clé en main. Je m'occupe de tout, vous vous concentrez sur votre cœur de métier.\n\nPuis-je vous envoyer une proposition personnalisée ?\n\nBien cordialement`,
    };
  }

  if (channel === "whatsapp") {
    return {
      a: `Bonjour ! 👋\n\nJe suis freelance digital à ${city}. J'ai remarqué que ${problemPhrase}.\n\n${lossEstimate}\n\nJe peux vous aider avec : ${detectedNeed.toLowerCase()} — rapidement et efficacement.\n\nÇa vous intéresse d'en discuter ? 😊`,
      b: `Salut ! 👋\n\nJe travaille avec des entreprises de ${neighborhood} pour améliorer leur présence en ligne.\n\nPour ${name}, j'ai identifié une opportunité : ${problemPhrase}. Ça représente une perte de clients non négligeable.\n\nJe peux vous apporter une solution rapide. On en parle ? 🙏`,
    };
  }

  // linkedin
  return {
    a: `Bonjour,\n\nJe suis freelance spécialisé en ${detectedNeed.toLowerCase()} pour les entreprises du secteur ${sector}.\n\nEn analysant ${name}, j'ai identifié que ${problemPhrase}. ${lossEstimate}\n\nJe serais ravi de vous proposer une solution concrète et performante.\n\nCordialement`,
    b: `Bonjour,\n\nPassionné par le développement digital des entreprises en Afrique de l'Ouest, je m'intéresse particulièrement au secteur ${sector}.\n\n${name} a un excellent potentiel, mais ${problemPhrase}. Avec les bonnes actions (${detectedNeed.toLowerCase()}), les résultats peuvent être rapides.\n\nPuis-je vous partager quelques idées ?\n\nÀ bientôt !`,
  };
}

const Messages = () => {
  const navigate = useNavigate();
  const [selectedProspectId, setSelectedProspectId] = useState("");
  const [channel, setChannel] = useState("email");
  const [copied, setCopied] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const unlockedProspects = prospects.filter((p) => !p.locked);
  const selectedProspect = prospects.find((p) => p.id === selectedProspectId);

  const messages = useMemo(() => {
    if (!selectedProspect) return null;
    return generateMessages(selectedProspect, channel);
  }, [selectedProspect, channel]);

  const handleGenerate = () => setGenerated(true);

  const handleCopy = (text: string, variant: string) => {
    navigator.clipboard.writeText(text);
    setCopied(variant);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegenerate = () => {
    setGenerated(false);
    setTimeout(() => setGenerated(true), 500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <DashboardLayout 
        onBack={generated ? () => setGenerated(false) : () => navigate("/prospects")} 
        hideDashboard
      >
        <div className="mx-auto max-w-3xl pt-8">
          <h1 className="text-2xl font-bold text-white">Générateur de messages</h1>
          <p className="mt-1 text-sm text-slate-400">
            Crée un message d'approche personnalisé grâce à l'IA
          </p>

        <div className="mt-8 space-y-6">
          {/* Prospect Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Prospect</label>
            <Select value={selectedProspectId} onValueChange={(v) => { setSelectedProspectId(v); setGenerated(false); }}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12 backdrop-blur-md hover:bg-white/10 transition-all">
                <SelectValue placeholder="Choisir un prospect" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                {unlockedProspects.map((p) => {
                  const config = getUrgencyConfig(getUrgencyLevel(p.matchScore));
                  return (
                    <SelectItem key={p.id} value={p.id} className="hover:bg-white/10 focus:bg-white/10">
                      {config.emoji} {p.name} — {p.city}, {p.neighborhood} ({p.matchScore}/100)
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Selected prospect info */}
          {selectedProspect && (
            <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm space-y-2 backdrop-blur-sm animate-fade-in">
              <p className="font-bold text-[#6366F1]">{selectedProspect.name} · {selectedProspect.sector}</p>
              <p className="text-slate-400">Signaux : <span className="text-slate-300">{selectedProspect.signals.join(", ")}</span></p>
              <p className="text-slate-400">Besoin : <span className="text-slate-300 italic">"{selectedProspect.detectedNeed}"</span></p>
            </div>
          )}

          {/* Channel */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Canal</label>
            {generated ? (
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl w-fit border border-white/10 backdrop-blur-md">
                {channel === "email" && <Mail className="h-4 w-4 text-[#6366F1]" />}
                {channel === "whatsapp" && <MessageCircle className="h-4 w-4 text-green-500" />}
                {channel === "linkedin" && <Linkedin className="h-4 w-4 text-[#0077b5]" />}
                <span className="text-sm font-bold capitalize">{channel}</span>
              </div>
            ) : (
              <Tabs value={channel} onValueChange={(v) => { setChannel(v); setGenerated(false); }}>
                <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-xl p-1 h-12 backdrop-blur-md">
                  <TabsTrigger value="email" className="gap-1.5 rounded-lg data-[state=active]:bg-[#6366F1] data-[state=active]:text-white text-slate-400">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </TabsTrigger>
                  <TabsTrigger value="whatsapp" className="gap-1.5 rounded-lg data-[state=active]:bg-[#6366F1] data-[state=active]:text-white text-slate-400">
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="gap-1.5 rounded-lg data-[state=active]:bg-[#6366F1] data-[state=active]:text-white text-slate-400">
                    <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* Generate Button */}
          {!generated && (
            <Button
              onClick={handleGenerate}
              disabled={!selectedProspectId}
              className="w-full gradient-primary text-primary-foreground border-0 shadow-primary"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Générer le message
            </Button>
          )}

          {/* Generated Messages */}
          {generated && messages && (
            <div className="space-y-6 animate-fade-in-up">
              {(["a", "b"] as const).map((variant) => (
                <div key={variant} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl shadow-black/20">
                  <div className="mb-4 flex items-center justify-between">
                    <Badge variant="secondary" className="bg-[#6366F1]/20 text-[#6366F1] border-[#6366F1]/30 font-bold px-3 py-1">
                      Version {variant.toUpperCase()}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
                        onClick={() => handleCopy(messages[variant], variant)}
                      >
                        {copied === variant ? (
                          <Check className="mr-1.5 h-3.5 w-3.5 text-[#6366F1]" />
                        ) : (
                          <Copy className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        {copied === variant ? "Copié !" : "Copier"}
                      </Button>
                    </div>
                  </div>
                  <p className="whitespace-pre-line text-[15px] text-slate-200 leading-relaxed font-medium">
                    {messages[variant]}
                  </p>
                </div>
              ))}

              <Button 
                onClick={handleRegenerate} 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold shadow-lg shadow-indigo-500/20 border-0 hover:opacity-90 transition-all"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Régénérer
              </Button>
            </div>
          )}
        </div>
      </div>
      </DashboardLayout>
    </div>
  );
};

export default Messages;
