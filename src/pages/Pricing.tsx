import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, ArrowLeft } from "lucide-react";

const features = [
  { name: "Prospects par jour", free: "3", pro: "Illimité", agency: "Illimité" },
  { name: "Messages IA par jour", free: "1", pro: "Illimité", agency: "Illimité" },
  { name: "Coach IA", free: "Limité", pro: "Complet", agency: "Complet" },
  { name: "Filtres avancés", free: false, pro: true, agency: true },
  { name: "Export des prospects", free: false, pro: true, agency: true },
  { name: "Multi-utilisateurs", free: false, pro: false, agency: true },
  { name: "API access", free: false, pro: false, agency: true },
  { name: "Account manager", free: false, pro: false, agency: true },
  { name: "Support prioritaire", free: false, pro: true, agency: true },
];
const Pricing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto px-4 py-12">
        <button 
          onClick={() => navigate(-1)} 
          className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-[#6366F1] hover:opacity-80 mb-12 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Propulse ton activité freelance</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Investis dans ta croissance avec des outils d'IA puissants et accède à des prospects qualifiés en illimité.</p>
        </div>

        {/* Plans */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 mb-20 items-center">
          {[
            { 
              name: "Freemium", 
              price: "0 FCFA", 
              period: "/mois", 
              cta: "Plan actuel", 
              highlight: false, 
              disabled: true,
              desc: "Parfait pour tester l'outil."
            },
            { 
              name: "PRO", 
              price: "5 000 FCFA", 
              period: "/mois", 
              cta: "Passer PRO", 
              highlight: true, 
              disabled: false,
              desc: "Le meilleur choix pour les freelances actifs."
            },
            { 
              name: "PREMIUM", 
              price: "10 000 FCFA", 
              period: "/mois", 
              cta: "Devenir Premium", 
              highlight: false, 
              disabled: false,
              desc: "Pour ceux qui veulent dominer leur marché."
            },
          ].map((plan) => (
            <div 
              key={plan.name} 
              className={`relative rounded-[2.5rem] border p-8 transition-all ${
                plan.highlight 
                ? "bg-white border-[#6366F1] shadow-2xl shadow-indigo-500/20 scale-110 z-10 py-12" 
                : "bg-white/50 border-slate-200"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Populaire
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">{plan.desc}</p>
              
              <div className="mt-8">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                <span className="text-slate-400 font-bold text-sm ml-1">{plan.period}</span>
              </div>

              <Button
                className={`mt-8 w-full h-12 rounded-2xl font-bold transition-all transform active:scale-95 ${
                  plan.highlight 
                  ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-xl shadow-indigo-500/30 hover:opacity-90 border-0" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
                disabled={plan.disabled}
              >
                {plan.cta}
              </Button>

              <div className="mt-8 space-y-4">
                {[
                  { label: "Prospects/jour", val: plan.name === "Freemium" ? "3" : "Illimité" },
                  { label: "Messages IA", val: plan.name === "Freemium" ? "1" : "Illimité" },
                  { label: "Coach IA", val: plan.name === "Freemium" ? "Limité" : "Complet" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{f.label}</span>
                    <span className="font-bold text-slate-900">{f.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Section (Simplified) */}
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Zap className="text-[#6366F1] h-6 w-6" /> Comparatif détaillé
          </h2>
          <div className="grid gap-6">
            {features.slice(0, 8).map((f, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-600 font-medium">{f.name}</span>
                <div className="flex gap-8">
                  <div className="flex flex-col items-center w-16">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">FREE</span>
                    {typeof f.free === "boolean" ? (f.free ? <Check className="h-4 w-4 text-slate-900" /> : <X className="h-4 w-4 text-slate-300" />) : <span className="text-xs font-bold">{f.free}</span>}
                  </div>
                  <div className="flex flex-col items-center w-16">
                    <span className="text-[10px] text-[#6366F1] font-bold uppercase mb-1">PRO</span>
                    {typeof f.pro === "boolean" ? (f.pro ? <Check className="h-4 w-4 text-[#6366F1]" /> : <X className="h-4 w-4 text-slate-300" />) : <span className="text-xs font-bold text-[#6366F1]">{f.pro}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
