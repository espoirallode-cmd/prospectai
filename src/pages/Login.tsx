import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.85 0-5.27-1.92-6.13-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.87 14.13c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13V7.03H2.18C1.43 8.53 1 10.21 1 12s.43 3.47 1.18 4.97l3.69-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.69 2.84c.86-2.59 3.28-4.51 6.13-4.51z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: localStorage.getItem("temp_firstName") || "",
    lastName: localStorage.getItem("temp_lastName") || "",
    email: localStorage.getItem("temp_email") || "",
  });

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://prospectai-seven.vercel.app/dashboard'
      }
    });
    
    if (error) {
      if (error.message.includes('popup')) {
        toast.error("Autorisez les popups pour continuer avec Google");
      } else {
        toast.error("Erreur de connexion Google, réessayez");
      }
      console.error('Erreur Google OAuth:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Tous les champs sont obligatoires");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email invalide");
      return;
    }
    
    setLoading(true);
    try {
      // Store names in localStorage to retrieve them after the magic link redirect
      localStorage.setItem("pending_prenom", formData.firstName);
      localStorage.setItem("pending_nom", formData.lastName);
      localStorage.setItem("temp_email", formData.email);

      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: window.location.origin + "/dashboard",
          data: {
            prenom: formData.firstName,
            nom: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
          }
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
              Connecte-toi pour trouver tes clients
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full h-[48px] flex items-center justify-center bg-white border border-[#e0e0e0] rounded-[12px] text-gray-700 font-medium hover:bg-gray-50 transition-all text-sm"
            >
              <GoogleIcon />
              Continuer avec Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-medium">Ou</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
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
              {loading ? "Chargement..." : "Se connecter"}
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
