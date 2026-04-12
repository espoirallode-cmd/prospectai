import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import DashboardLayout from "@/components/DashboardLayout";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const SettingsPage = () => {
  const { profile, user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    skills: [] as string[],
    city: "",
    radius: 10,
    tjm: 0,
    plan: "freemium"
  });

  useEffect(() => {
    if (profile) {
      setUser({
        firstName: profile.prenom || "",
        lastName: profile.nom || "",
        email: profile.email || "",
        skills: profile.competences || [],
        city: profile.ville || "",
        radius: profile.rayon_km || 10,
        tjm: profile.tarif_fcfa || 0,
        plan: profile.plan || "freemium"
      });
    }
  }, [profile]);

  const [sectors, setSectors] = useState<string[]>(["Santé", "Immobilier"]);
  const [excludeTags, setExcludeTags] = useState<string[]>(["Assurance", "Trading"]);
  const [newSkill, setNewSkill] = useState("");
  const [newExclude, setNewExclude] = useState("");

  const handleSave = async () => {
    if (!authUser) return;
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          prenom: user.firstName,
          nom: user.lastName,
          email: user.email,
          competences: user.skills,
          ville: user.city,
          rayon_km: user.radius,
          tarif_fcfa: user.tjm,
        })
        .eq('id', authUser.id);

      if (error) throw error;
      toast.success("Modifications enregistrées !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
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
      const newSkills = [...user.skills];
      newSkills.splice(index, 1);
      setUser({ ...user, skills: newSkills });
    } else {
      const newExclude = [...excludeTags];
      newExclude.splice(index, 1);
      setExcludeTags(newExclude);
    }
  };

  const getInitials = () => {
    return ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase() || "??";
  };

  return (
    <DashboardLayout>
      <div className="bg-[#0a0a0f] min-h-screen text-white">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Paramètres <span className="text-2xl">⚙️</span>
          </h1>
          <p className="text-white/40 mt-2">Gérez vos préférences et votre profil freelance</p>
        </header>

        <div className="max-w-4xl space-y-10 pb-20">
          
          {/* Section 1 — Profil freelance */}
          <section className="bg-[#1a1a2e] rounded-3xl border border-[#6366F1]/20 p-8 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
              <User className="text-[#6366F1] h-6 w-6" /> Profil freelance
            </h2>
            
            <div className="space-y-8">
              {/* Photo Upload */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-white/5 group-hover:opacity-80 transition-opacity">
                    {getInitials()}
                  </div>
                  <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#6366F1] flex items-center justify-center shadow-lg border-2 border-[#1a1a2e] hover:scale-110 transition-transform">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Photo de profil</h3>
                  <p className="text-sm text-white/40">JPG ou PNG. Max 5MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white/70">Prénom</Label>
                  <Input 
                    value={user.firstName} 
                    onChange={(e) => setUser({...user, firstName: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-[#6366F1]/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Nom</Label>
                  <Input 
                    value={user.lastName} 
                    onChange={(e) => setUser({...user, lastName: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-[#6366F1]/40"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-white/70">Email professionnel</Label>
                  <Input 
                    value={user.email} 
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-[#6366F1]/40"
                  />
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-3">
                <Label className="text-white/70">Compétences</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                  {user.skills.map((skill, i) => (
                    <Badge key={i} className="bg-[#6366F1]/20 text-[#6366F1] border-[#6366F1]/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      {skill}
                      <button onClick={() => removeTag("skill", i)}>
                        <X className="h-3 w-3 hover:text-white transition-colors" />
                      </button>
                    </Badge>
                  ))}
                  <div className="flex gap-2 ml-1">
                    <input 
                      placeholder="Ajouter..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag("skill")}
                      className="bg-transparent text-sm outline-none border-none placeholder:text-white/20 w-24"
                    />
                    <button onClick={() => addTag("skill")}><Plus className="h-4 w-4 text-white/40 hover:text-white" /></button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white/70">Tarif souhaité (FCFA/projet)</Label>
                  <Input 
                    type="number" 
                    value={user.tjm} 
                    onChange={(e) => setUser({...user, tjm: Number(e.target.value)})}
                    className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-[#6366F1]/40"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-[#6366F1] hover:bg-[#8B5CF6] text-white font-bold px-8 py-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
              >
                {loading ? "Enregistrement..." : <><Save className="mr-2 h-5 w-5" /> Enregistrer les modifications</>}
              </Button>
            </div>
          </section>

          {/* Section 2 — Localisation & recherche */}
          <section className="bg-[#1a1a2e] rounded-3xl border border-[#6366F1]/20 p-8 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
              <MapPin className="text-[#6366F1] h-6 w-6" /> Localisation & recherche
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white/70">Ville principale</Label>
                  <Input 
                    placeholder="Cotonou"
                    value={user.city}
                    onChange={(e) => setUser({...user, city: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-[#6366F1]/40"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-white/70">Rayon de recherche</Label>
                    <span className="text-[#6366F1] font-bold">{user.radius} km</span>
                  </div>
                  <Slider 
                    value={[user.radius]} 
                    onValueChange={(v) => setUser({...user, radius: v[0]})}
                    min={1} 
                    max={50} 
                    step={1}
                    className="py-4"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white/70">Secteurs privilégiés</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {["Santé", "Hôtellerie", "Éducation", "Immobilier", "Restauration", "Juridique", "Automobile", "Commerce", "BTP", "Banque"].map((s) => (
                    <div key={s} className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                      <Checkbox 
                        id={`sector-${s}`}
                        checked={sectors.includes(s)}
                        onCheckedChange={(checked) => {
                          if (checked) setSectors([...sectors, s]);
                          else setSectors(sectors.filter(sec => sec !== s));
                        }}
                      />
                      <label htmlFor={`sector-${s}`} className="text-xs font-medium cursor-pointer">{s}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white/70">Secteurs à exclure</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                  {excludeTags.map((tag, i) => (
                    <Badge key={i} className="bg-red-500/20 text-red-500 border-red-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      {tag}
                      <button onClick={() => removeTag("exclude", i)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <div className="flex gap-2 ml-1">
                    <input 
                      placeholder="Exclure..."
                      value={newExclude}
                      onChange={(e) => setNewExclude(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag("exclude")}
                      className="bg-transparent text-sm outline-none border-none placeholder:text-white/20 w-24"
                    />
                    <button onClick={() => addTag("exclude")}><Plus className="h-4 w-4 text-white/40 hover:text-white" /></button>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="bg-[#6366F1] hover:bg-[#8B5CF6] text-white font-bold px-8 py-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/20">
                <Save className="mr-2 h-5 w-5" /> Enregistrer les réglages
              </Button>
            </div>
          </section>

          {/* Section 3 — Notifications */}
          <section className="bg-[#1a1a2e] rounded-3xl border border-[#6366F1]/20 p-8 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
              <Bell className="text-[#6366F1] h-6 w-6" /> Notifications
            </h2>

            <div className="space-y-6">
              {[
                { label: "Alertes nouveaux prospects urgents", defaultChecked: true },
                { label: "Rappels de relance prospects", defaultChecked: false, extra: true },
                { label: "Notifications par email", defaultChecked: true },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="space-y-1">
                    <p className="font-medium">{n.label}</p>
                    {n.extra && (
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-white/40 italic">Délai :</span>
                        <div className="flex gap-2">
                          {["2j", "5j", "7j"].map((d) => (
                            <button key={d} className={`px-3 py-1 text-[10px] rounded-full border ${d === "2j" ? "bg-[#6366F1] border-[#6366F1]" : "border-white/10 text-white/40"}`}>{d}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Switch className="data-[state=checked]:bg-[#6366F1]" defaultChecked={n.defaultChecked} />
                </div>
              ))}

              <Button onClick={handleSave} className="bg-[#6366F1] hover:bg-[#8B5CF6] text-white font-bold px-8 py-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 mt-4">
                <Save className="mr-2 h-5 w-5" /> Enregistrer
              </Button>
            </div>
          </section>

          {/* Section 4 — Abonnement & facturation */}
          <section className="bg-[#1a1a2e] rounded-3xl border border-[#6366F1]/20 p-8 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
              <CreditCard className="text-[#6366F1] h-6 w-6" /> Abonnement & facturation
            </h2>

            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="space-y-1">
                  <h3 className="text-sm text-white/40 font-bold uppercase tracking-widest">Plan actuel</h3>
                  <Badge className={`px-4 py-1.5 rounded-full text-xs font-bold ${user.plan === "Freemium" ? "bg-gray-500" : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"}`}>
                    {user.plan}
                  </Badge>
                </div>
                {user.plan === "Freemium" && (
                  <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold h-12 px-6 rounded-xl hover:opacity-90 shadow-lg shadow-indigo-500/20">
                    Passer PRO — 5 000 FCFA/mois
                  </Button>
                )}
              </div>

              {user.plan === "Freemium" && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Accès illimité aux prospects",
                    "Coach IA personnalisé complet",
                    "Générateur de messages IA sans limite",
                    "Support prioritaire 24/7"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-[#6366F1]" />
                      {f}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="font-bold flex items-center gap-2">Historique des paiements</h3>
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
                      <TableRow className="hover:bg-white/5 border-white/5">
                        <TableCell colSpan={3} className="text-center py-12 text-white/20 italic">
                          Aucun paiement pour le moment
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 — Sécurité */}
          <section className="bg-[#1a1a2e] rounded-3xl border border-[#6366F1]/20 p-8 shadow-xl overflow-hidden relative">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
              <Lock className="text-[#6366F1] h-6 w-6" /> Sécurité
            </h2>

            <div className="space-y-10">
              {/* Change Password Form */}
              <div className="space-y-6">
                <h3 className="font-bold text-lg">Changer mon mot de passe</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white/70">Ancien mot de passe</Label>
                    <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70">Nouveau mot de passe</Label>
                    <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70">Confirmer</Label>
                    <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 rounded-xl" />
                  </div>
                </div>
                <Button variant="outline" className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white rounded-xl h-12 px-8 font-bold transition-all">
                  Mettre à jour le mot de passe
                </Button>
              </div>

              <div className="pt-10 border-t border-red-500/10 -mx-8 px-8 bg-red-500/5">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-red-500 font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                        <Trash2 className="h-4 w-4" /> Zone danger
                      </h3>
                      <p className="text-sm text-red-500/60">Supprimer mon compte — Cette action est irréversible</p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-xl transition-all shadow-lg shadow-red-600/20">
                          Supprimer mon compte
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1a1a2e] border-red-500/20 text-white rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-red-500">
                            <AlertCircle className="h-8 w-8" /> Es-tu sûr ?
                          </DialogTitle>
                          <DialogDescription className="text-white/60 py-4 text-lg">
                            Cette action est définitive. Toutes vos données, vos messages et votre historique seront perdus définitivement.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-4 mt-8">
                          <Button variant="ghost" className="flex-1 h-16 rounded-2xl hover:bg-white/5 transition-all text-white font-bold">
                            Annuler
                          </Button>
                          <Button className="flex-1 h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xl shadow-red-600/30">
                            Confirmer la suppression
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                 </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
