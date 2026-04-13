import { useState, useEffect } from "react";
import { 
  User, 
  MapPin, 
  Bell, 
  CreditCard, 
  Lock, 
  Trash2, 
  Save, 
  Plus, 
  X, 
  Camera,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const SettingsView = () => {
  const { profile, user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: profile?.prenom || "",
    lastName: profile?.nom || "",
    email: profile?.email || "",
    skills: profile?.competences || ["Développeur Web", "Designer UI/UX"],
    photo: profile?.photo_url || null,
    plan: profile?.plan || "Freemium",
    notifications: {
      urgents: true,
      reminders: false,
      email: true,
      app: true,
      delay: "2j"
    }
  });

  useEffect(() => {
    if (profile) {
      setUser(prev => ({
        ...prev,
        firstName: profile.prenom || "",
        lastName: profile.nom || "",
        email: profile.email || "",
        skills: profile.competences && profile.competences.length > 0 
          ? profile.competences 
          : ["Développeur Web", "Designer UI/UX"],
        photo: profile.photo_url || null,
        plan: profile.plan || "Freemium",
      }));
    }
  }, [profile]);

  const [sectors, setSectors] = useState<string[]>(["Santé", "Immobilier"]);
  const [excludeTags, setExcludeTags] = useState<string[]>(["Assurance", "Trading"]);
  const [newSkill, setNewSkill] = useState("");
  const [newExclude, setNewExclude] = useState("");
  const [isSaving, setIsSaving] = useState<"profile" | "notifications" | null>(null);

  const handleSave = async (section: "profile" | "notifications") => {
    if (!authUser) return;
    setIsSaving(section);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          prenom: user.firstName,
          nom: user.lastName,
          email: user.email,
          competences: user.skills,
          photo_url: user.photo,
        })
        .eq('id', authUser.id);

      if (error) throw error;
      toast.success("✅ Modifications enregistrées !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(null);
    }
  };

  const updateNotif = (key: string, value: any) => {
    setUser({
      ...user,
      notifications: { ...user.notifications, [key]: value }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux (max 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUser({ ...user, photo: base64String });
        toast.success("Photo de profil mise à jour localement. N'oubliez pas d'enregistrer !");
      };
      reader.readAsDataURL(file);
    }
  };

  const deletePhoto = () => {
    setUser({ ...user, photo: null });
    toast.success("Photo de profil supprimée localement. N'oubliez pas d'enregistrer !");
  };

  const addTag = (type: "skill" | "exclude") => {
    const val = type === "skill" ? newSkill : newExclude;
    if (!val.trim()) return;
    if (type === "skill") {
      setUser({ ...user, skills: [...user.skills, val] });
      setNewSkill("");
    } else {
      setExcludeTags([...excludeTags, val]);
      setNewExclude("");
    }
  };

  const removeTag = (type: "skill" | "exclude", index: number) => {
    if (type === "skill") {
      setUser({ ...user, skills: user.skills.filter((_: any, i: number) => i !== index) });
    } else {
      setExcludeTags(excludeTags.filter((_, i) => i !== index));
    }
  };

  const getInitials = () => {
    return ((user.firstName[0] || "") + (user.lastName[0] || "")).toUpperCase();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 pb-20 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          Paramètres <span className="text-2xl">⚙️</span>
        </h1>
        <p className="text-white/40 mt-2">Gérez vos préférences et votre profil freelance</p>
      </header>

      {/* Section 1 — Profil freelance */}
      <section className="bg-[#1a1a2e] rounded-3xl border border-[#6366F1]/20 p-8 shadow-xl">
        <h2 className="text-xl font-bold flex items-center gap-3 mb-8 text-white">
          <User className="text-[#6366F1] h-6 w-6" /> Profil freelance
        </h2>
        
        <div className="space-y-8">
          {/* Photo Menu Area */}
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <div className="relative group">
                <DropdownMenuTrigger asChild>
                  <button className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-white/5 transition-all hover:ring-[#6366F1]/40 active:scale-95 outline-none">
                    {user.photo ? (
                      <img src={user.photo} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      getInitials()
                    )}
                  </button>
                </DropdownMenuTrigger>
                
                <label className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#6366F1] flex items-center justify-center shadow-lg border-2 border-[#1a1a2e] cursor-pointer hover:scale-110 active:scale-90 transition-all z-10">
                  <Camera className="h-4 w-4 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>

              <DropdownMenuContent className="bg-[#1a1a2e] border-[#6366F1]/20 text-white rounded-xl shadow-2xl p-2 w-48">
                <label className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-all outline-none">
                  <Plus className="h-4 w-4" /> 
                  <span>Changer la photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
                {user.photo && (
                  <DropdownMenuItem onClick={deletePhoto} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-400 focus:bg-red-500/10 transition-all outline-none border-t border-white/5 mt-1 pt-3">
                    <Trash2 className="h-4 w-4" /> 
                    <span>Supprimer la photo</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div>
              <h3 className="font-bold text-lg text-white">Photo de profil</h3>
              <p className="text-sm text-white/40">Clique pour gérer • Max 5MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/70">Prénom</Label>
              <Input 
                value={user.firstName} 
                onChange={(e) => setUser({...user, firstName: e.target.value})}
                className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-[#6366F1]/40 text-white"
                placeholder="Ex: Fidele"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Nom</Label>
              <Input 
                value={user.lastName} 
                onChange={(e) => setUser({...user, lastName: e.target.value})}
                className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-[#6366F1]/40 text-white"
                placeholder="Ex: Allode"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-white/70">Email professionnel</Label>
              <Input 
                value={user.email} 
                onChange={(e) => setUser({...user, email: e.target.value})}
                className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-[#6366F1]/40 text-white"
                placeholder="Ex: fidele@prospectai.com"
              />
            </div>
          </div>

          {/* Skills Tags */}
          <div className="space-y-3">
            <Label className="text-white/70">Compétences</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
              {user.skills.map((skill: string, i: number) => (
                <Badge key={i} className="bg-[#6366F1]/20 text-[#6366F1] border-[#6366F1]/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  {skill}
                  <button onClick={() => removeTag("skill", i)}>
                    <X className="h-3 w-3 hover:text-white transition-colors" />
                  </button>
                </Badge>
              ))}
              <div className="flex gap-2 ml-1">
                <input 
                  placeholder="Ajouter une compétence..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag("skill")}
                  className="bg-transparent text-sm outline-none border-none placeholder:text-white/20 w-40 text-white"
                />
                <button onClick={() => addTag("skill")}><Plus className="h-4 w-4 text-white/40 hover:text-white" /></button>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-start mt-6 md:mt-0">
            <Button 
              onClick={() => handleSave("profile")} 
              disabled={isSaving === "profile"}
              className="bg-[#6366F1] hover:bg-[#8B5CF6] text-white font-bold px-8 py-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 w-full md:w-auto min-w-[240px]"
            >
              {isSaving === "profile" ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Save className="h-5 w-5" /> Enregistrer les modifications
                </span>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Section 3 — Notifications */}
      <section className="bg-[#1a1a2e] rounded-3xl border border-[#6366F1]/20 p-8 shadow-xl">
        <h2 className="text-xl font-bold flex items-center gap-3 mb-8 text-white">
          <Bell className="text-[#6366F1] h-6 w-6" /> Notifications
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <p className="font-medium text-white">Alertes nouveaux prospects urgents</p>
            <Switch 
              checked={user.notifications.urgents} 
              onCheckedChange={(v) => updateNotif("urgents", v)}
              className="data-[state=checked]:bg-[#6366F1]" 
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="space-y-1">
              <p className="font-medium text-white">Rappels de relance prospects</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-white/40 italic">Délai :</span>
                <div className="flex gap-2">
                  {["2j", "5j", "7j"].map((d) => (
                    <button 
                      key={d} 
                      onClick={() => updateNotif("delay", d)}
                      className={`px-3 py-1 text-[10px] rounded-full border transition-all ${user.notifications.delay === d ? "bg-[#6366F1] border-[#6366F1] text-white" : "border-white/10 text-white/40 hover:border-white/20"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Switch 
              checked={user.notifications.reminders} 
              onCheckedChange={(v) => updateNotif("reminders", v)}
              className="data-[state=checked]:bg-[#6366F1]" 
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <p className="font-medium text-white">Notifications par email</p>
            <Switch 
              checked={user.notifications.email} 
              onCheckedChange={(v) => updateNotif("email", v)}
              className="data-[state=checked]:bg-[#6366F1]" 
            />
          </div>



          <Button 
            onClick={() => handleSave("notifications")} 
            disabled={isSaving === "notifications"}
            className="bg-[#6366F1] hover:bg-[#8B5CF6] text-white font-bold px-8 py-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 mt-4 disabled:opacity-50 min-w-[200px]"
          >
            {isSaving === "notifications" ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </span>
            ) : (
              "Enregistrer les préférences"
            )}
          </Button>
        </div>
      </section>

      {/* Section 4 — Abonnement & facturation */}
      <section className="bg-[#1a1a2e] rounded-3xl border border-[#6366F1]/20 p-5 md:p-8 shadow-xl">
        <h2 className="text-[16px] md:text-xl font-bold flex items-center gap-2 md:gap-3 mb-6 md:mb-8 text-white whitespace-nowrap">
          <CreditCard className="text-[#6366F1] h-5 w-5 md:h-6 md:w-6 shrink-0" /> Abonnement & facturation
        </h2>

        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 gap-5 md:gap-0">
            <div className="space-y-1.5 flex flex-col items-center md:items-start w-full md:w-auto">
              <h3 className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest px-2">Plan actuel</h3>
              <Badge className={`px-4 py-2 md:py-1.5 rounded-xl md:rounded-full text-[11px] md:text-xs font-bold w-full md:w-auto justify-center ${user.plan === "Freemium" ? "bg-gray-500" : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"}`}>
                {user.plan}
              </Badge>
            </div>
            {user.plan === "Freemium" && (
              <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 w-full md:w-auto">
                <Button className="w-full md:w-auto bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold h-10 md:h-12 px-4 md:px-6 rounded-xl hover:opacity-90 shadow-md md:shadow-lg shadow-indigo-500/20 text-[10px] md:text-sm whitespace-nowrap">
                  Passer PRO — 5 000 FCFA/mois
                </Button>
                <Button className="w-full md:w-auto bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold h-10 md:h-12 px-4 md:px-6 rounded-xl hover:opacity-90 shadow-md md:shadow-lg shadow-indigo-500/20 text-[10px] md:text-sm whitespace-nowrap">
                  Offre Premium — 10 000 FCFA/mois
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="font-bold flex items-center gap-2 text-white">Historique des paiements</h3>
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="text-white font-bold">Date</TableHead>
                    <TableHead className="text-white font-bold">Montant</TableHead>
                    <TableHead className="text-white font-bold">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-white/5 border-white/5 text-white/20">
                    <TableCell colSpan={3} className="text-center py-12 italic">
                      Aucun paiement pour le moment
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
