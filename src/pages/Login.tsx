import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: localStorage.getItem("temp_firstName") || "",
    lastName: localStorage.getItem("temp_lastName") || "",
    email: localStorage.getItem("temp_email") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    try {
      // Store names in localStorage to retrieve them after the magic link redirect
      localStorage.setItem("temp_firstName", formData.firstName);
      localStorage.setItem("temp_lastName", formData.lastName);
      localStorage.setItem("temp_email", formData.email);

      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: window.location.origin + "/dashboard",
        },
      });

      if (error) throw error;

      toast.success("Lien de connexion envoyé par email !");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-[12px] p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-indigo-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#0a0a0f]">Prospect<span className="text-[#6366F1]">AI</span></span>
            </div>
            
            <h1 className="text-2xl font-bold text-[#0a0a0f] mb-2 text-center">Se connecter</h1>
            <p className="text-sm text-gray-500 text-center">
              Recois un lien magique de connexion par email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6366F1] transition-colors">
                <User className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Prénom"
                required
                className="pl-11 h-12 rounded-[12px] border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 placeholder:text-gray-400"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6366F1] transition-colors">
                <User className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Nom"
                required
                className="pl-11 h-12 rounded-[12px] border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 placeholder:text-gray-400"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6366F1] transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <Input
                type="email"
                placeholder="Adresse email"
                required
                className="pl-11 h-12 rounded-[12px] border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-[12px] bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 text-white font-bold text-base shadow-lg shadow-indigo-500/30 transition-all mt-4 border-0"
            >
              {loading ? "Chargement..." : "Envoyer le lien magique"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            En continuant, vous acceptez nos <a href="#" className="underline">Conditions d'utilisation</a>
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <Link to="/" className="text-gray-500 text-sm hover:text-white transition-colors">Retour à l'accueil</Link>
          <div className="w-1 h-1 rounded-full bg-gray-800 self-center"></div>
          <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Aide</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
