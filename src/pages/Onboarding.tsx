import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  MapPin,
  Target,
  Loader2,
  X,
  ArrowRight,
  ArrowLeft,
  Zap,
  Search,
  Brain,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { skillOptions, cityOptions } from "@/data/prospects";

const steps = [
  { icon: User, label: "Profil" },
  { icon: MapPin, label: "Localisation" },
  { icon: Target, label: "Objectifs" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState("25");
  const [goal, setGoal] = useState("");
  const [loadingStep, setLoadingStep] = useState(-1);

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) setSkills([...skills, skill]);
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const canNext = () => {
    if (step === 0) return name && skills.length > 0 && experience;
    if (step === 1) return city;
    if (step === 2) return goal;
    return false;
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setStep(3); // loading
    }
  };

  // Loading animation
  useEffect(() => {
    if (step !== 3) return;
    const timers = [
      setTimeout(() => setLoadingStep(0), 500),
      setTimeout(() => setLoadingStep(1), 1500),
      setTimeout(() => setLoadingStep(2), 2800),
      setTimeout(() => setLoadingStep(3), 4000),
      setTimeout(() => navigate("/prospects"), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step, navigate]);

  const loadingSteps = [
    { icon: Search, text: "Scan des entreprises locales..." },
    { icon: Brain, text: "Analyse des besoins détectés..." },
    { icon: MessageSquare, text: "Préparation des messages..." },
    { icon: CheckCircle2, text: "Opportunités prêtes !" },
  ];

  if (step === 3) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto w-full max-w-md px-4 text-center">
          <div className="relative mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-primary">
              <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
            </div>
            <div className="absolute inset-0 flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 animate-pulse-ring" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Analyse en cours...</h2>
          <p className="mb-10 text-muted-foreground">Notre IA scanne les opportunités pour toi</p>
          <div className="space-y-4 text-left">
            {loadingSteps.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg border p-4 transition-all duration-500 ${
                  i <= loadingStep
                    ? "border-primary/30 bg-accent"
                    : "opacity-40"
                }`}
              >
                <s.icon
                  className={`h-5 w-5 ${
                    i <= loadingStep ? "text-primary" : "text-muted-foreground"
                  } ${i === loadingStep ? "animate-pulse" : ""}`}
                />
                <span
                  className={`text-sm font-medium ${
                    i <= loadingStep ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.text}
                </span>
                {i < loadingStep && (
                  <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 relative overflow-hidden">
      {/* Global Back Button in Corner */}
      <div className="absolute top-8 left-8 z-50">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl px-5 py-2 h-11 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 border-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-bold">Dashboard</span>
        </Button>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="max-w-xl mx-auto relative">
        {/* Centered Logo Header */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">ProspectAI</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  i <= step
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-8 ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-8">
          {/* Step 1 */}
          {step === 0 && (
            <div className="animate-fade-in-up space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Ton profil freelance</h2>
                <p className="mt-1 text-sm text-muted-foreground">Dis-nous en plus sur toi</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Ex: Kofi Mensah" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Compétences</Label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <Badge key={s} variant="secondary" className="bg-accent text-accent-foreground cursor-pointer" onClick={() => removeSkill(s)}>
                      {s} <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillOptions
                    .filter((s) => !skills.includes(s))
                    .map((s) => (
                      <Badge key={s} variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => addSkill(s)}>
                        + {s}
                      </Badge>
                    ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Niveau d'expérience</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant (0-1 an)</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire (1-3 ans)</SelectItem>
                    <SelectItem value="expert">Expert (3+ ans)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="animate-fade-in-up space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Ta localisation</h2>
                <p className="mt-1 text-sm text-muted-foreground">Où cherches-tu des clients ?</p>
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger><SelectValue placeholder="Choisir une ville" /></SelectTrigger>
                  <SelectContent>
                    {cityOptions.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="radius">Rayon de recherche (km)</Label>
                <Input id="radius" type="number" value={radius} onChange={(e) => setRadius(e.target.value)} min="5" max="200" />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="animate-fade-in-up space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Ton objectif</h2>
                <p className="mt-1 text-sm text-muted-foreground">Qu'est-ce qui compte le plus pour toi ?</p>
              </div>
              <RadioGroup value={goal} onValueChange={setGoal} className="space-y-3">
                {[
                  { value: "first-client", label: "Trouver mon premier client", desc: "Je débute et je veux décrocher ma première mission" },
                  { value: "grow-revenue", label: "Augmenter mon chiffre d'affaires", desc: "J'ai déjà des clients mais je veux scaler" },
                  { value: "portfolio", label: "Construire mon portfolio", desc: "Je veux des projets pour enrichir mon portfolio" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all hover:border-primary/30 ${
                      goal === opt.value ? "border-primary bg-accent" : ""
                    }`}
                  >
                    <RadioGroupItem value={opt.value} className="mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{opt.label}</p>
                      <p className="text-sm text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between gap-4">
            <Button 
              variant="ghost" 
              onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
              className="px-6 h-12 rounded-xl transition-all font-bold border-white/10 text-white/60 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold shadow-lg shadow-indigo-500/20 border-0 hover:opacity-90 transition-all"
            >
              {step === 2 ? "Analyser" : "Suivant"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
