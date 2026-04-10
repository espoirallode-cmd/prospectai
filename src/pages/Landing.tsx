import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  MessageSquareText,
  Trophy,
  ArrowRight,
  Check,
  Zap,
  Users,
  Target,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import { useState } from "react";

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Est-ce que l'IA peut vraiment trouver des clients pour moi ?",
      a: "Oui, ProspectAI analyse en continu les données locales et les signaux d'affaires pour identifier les entreprises qui ont des besoins réels en services freelance."
    },
    {
      q: "Quel est le délai pour obtenir mes premiers prospects ?",
      a: "Généralement, vos premières opportunités qualifiées apparaissent sur votre dashboard en moins de 24h après la configuration de votre profil."
    },
    {
      q: "Le coach closing est-il vraiment efficace ?",
      a: "Le coach IA est entraîné sur des milliers de scripts de vente réussis. Il vous guide étape par étape pour transformer une simple prise de contact en contrat signé."
    },
    {
      q: "Puis-je annuler mon abonnement PRO à tout moment ?",
      a: "Absolument. Nous proposons un abonnement sans engagement que vous pouvez suspendre ou annuler d'un simple clic depuis vos réglages."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg gradient-primary">
              <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary-foreground" />
            </div>
            <span className="text-base md:text-lg font-bold text-foreground">ProspectAI</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Témoignages</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">Se connecter</Button>
            </Link>
            <Link to="/login" className="hidden md:block">
              <Button size="sm" className="gradient-primary shadow-primary text-primary-foreground border-0">Commencer</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-4 pb-0">
        <div className="w-full">
          <div className="hero-custom-bg px-2 pt-12 pb-12 md:px-6 md:py-24 text-center overflow-hidden">
            <div className="relative z-10 mx-auto max-w-4xl pt-4 md:pt-0 -mt-2 md:-mt-5">
              {/* Small Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white text-primary mb-3 md:mb-4 animate-fade-in-up">
                <Zap className="h-3 md:h-3.5 w-3 md:w-3.5 fill-primary" />
                <span className="text-[9px] md:text-xs font-bold tracking-wider uppercase">Prospection, Closing & Automatisation</span>
              </div>
              
              <h1 className="text-hero-title mb-1.5 animate-fade-in-up">
                Trouve tes premiers clients <br className="hidden md:block" />
                freelance en <span className="opacity-80">24h</span>
              </h1>
              
              <p className="text-hero-sub mb-4 animate-fade-in-up-delay-1 px-4">
                ProspectAI analyse les entreprises locales et détecte celles qui ont besoin de tes services. <br className="hidden md:block" />
                Messages personnalisés, coaching closing — tout est automatisé.
              </p>
              
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-fade-in-up-delay-2">
                <Link to="/login">
                  <Button size="default" className="h-9 md:h-10 px-4 md:px-5 text-[10px] md:text-xs font-bold rounded-xl bg-primary text-white border-0 shadow-lg hover:scale-105 transition-transform uppercase tracking-wider">
                    Découvrir mes opportunités
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <div className="flex items-center gap-2.5 md:gap-3">
                  <div className="flex -space-x-2.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-7 md:h-8 w-7 md:w-8 rounded-full border-2 border-white/20 bg-muted/20 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=user${i+10}`} alt="user" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-[11px] font-bold text-white">Testé et approuvé</p>
                    <p className="text-[9px] text-white/50">par + de 100 freelances</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* The background image already contains the dashboard at the bottom, 
                so we only provide enough height and padding for it to show. */}
            <div className="h-20 md:h-64 lg:h-80 mt-4 md:mt-5" />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Vrais prospects locaux", desc: "Des entreprises réelles près de chez toi, analysées par notre IA pour détecter leurs besoins." },
            { icon: MessageSquareText, title: "Messages personnalisés IA", desc: "Génère des messages d'approche uniques adaptés à chaque prospect et canal de communication." },
            { icon: Trophy, title: "Coach closing intégré", desc: "Un coach IA qui t'accompagne du premier contact jusqu'à la signature du contrat." },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`animate-fade-in-up-delay-${i + 1} group rounded-2xl p-8 transition-all hover:shadow-2xl hover:-translate-y-1 gradient-primary text-white border-0 shadow-lg shadow-primary/20`}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/10">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-sm text-white/80 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto grid grid-cols-3 gap-8 px-4 py-16 text-center">
          {[
            { value: "2,400+", label: "Freelancers actifs" },
            { value: "18,000+", label: "Prospects trouvés" },
            { value: "34%", label: "Taux de réponse moyen" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-gradient md:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
          Ils ont déjà trouvé leurs clients
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              name: "Thomas Dubois",
              role: "Développeur Fullstack",
              content: "J'ai trouvé mon premier client en moins de 48h. L'IA a détecté une brasserie locale qui cherchait un site e-commerce. Le message généré a fait mouche immédiatement.",
              rating: 5
            },
            {
              name: "Sarah Martin",
              role: "Social Media Manager",
              content: "Le coach closing m'a aidé à justifier mes tarifs. J'ai signé un contrat à 1500€/mois grâce aux conseils de négociation en temps réel.",
              rating: 5
            },
            {
              name: "Marc Lefebvre",
              role: "UI/UX Designer",
              content: "ProspectAI me fait gagner au moins 10h par semaine sur ma prospection. Les opportunités sont qualifiées et vraiment pertinentes pour mon profil.",
              rating: 5
            }
          ].map((t, i) => (
            <div key={t.name} className="flex flex-col rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 flex-grow text-sm italic text-muted-foreground leading-relaxed">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${t.name}`} alt={t.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
          Un plan pour chaque ambition
        </h2>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {[
            {
              name: "Freemium",
              price: "0 FCFA",
              period: "/mois",
              features: ["3 prospects/jour", "1 message IA/jour", "Coach IA limité"],
              cta: "Commencer gratuitement",
              highlight: false,
            },
            {
              name: "PRO",
              price: "5 000 FCFA",
              period: "/mois",
              features: ["Prospects illimités", "Messages IA illimités", "Coach IA complet", "Filtres avancés", "Support prioritaire"],
              cta: "Passer PRO",
              highlight: true,
            },
            {
              name: "Agences",
              price: "10 000 FCFA",
              period: "/mois",
              features: ["Multi-utilisateurs", "API access", "Onboarding dédié", "Dashboard équipe", "Account manager"],
              cta: "Choisir Agence",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all hover:-translate-y-1 gradient-primary text-white border-0 ${
                plan.highlight
                  ? "shadow-2xl shadow-primary/40 scale-105 z-10"
                  : "shadow-xl shadow-primary/10"
              }`}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary font-bold border-0 shadow-lg px-4">
                  Populaire
                </Badge>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="text-white/70 ml-1">{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-medium">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="mt-10 block">
                <Button
                  className={`w-full h-11 rounded-xl font-bold transition-all ${
                    plan.highlight
                      ? "bg-white text-primary hover:bg-white/90 shadow-xl"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
                  }`}
                  variant="default"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
          Questions fréquentes
        </h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border bg-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-foreground">{faq.q}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                  {openFaq === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded gradient-primary">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">ProspectAI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Témoignages</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ProspectAI. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
