import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, User, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: localStorage.getItem("user_firstName") || "",
    lastName: localStorage.getItem("user_lastName") || "",
    email: localStorage.getItem("user_email") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    // Simulate login success
    localStorage.setItem("user_firstName", formData.firstName);
    localStorage.setItem("user_lastName", formData.lastName);
    localStorage.setItem("user_email", formData.email);
    toast.success("Connexion réussie !");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-white rounded-[12px] p-8 shadow-2xl relative overflow-hidden">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-indigo-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#0a0a0f]">Prospect<span className="text-[#6366F1]">AI</span></span>
            </div>
            
            <h1 className="text-2xl font-bold text-[#0a0a0f] mb-2 text-center">Se connecter</h1>
            <p className="text-sm text-gray-500 text-center">
              <span className="text-[#6366F1] font-semibold">
                Créer votre compte
              </span>
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-8">
            <div className="h-px bg-gray-100 flex-grow"></div>
          </div>

          {/* Form */}
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
              className="w-full h-12 rounded-[12px] bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 text-white font-bold text-base shadow-lg shadow-indigo-500/30 transition-all mt-4 border-0"
            >
              Se connecter
            </Button>
          </form>

          {/* Footer Text */}
          <p className="mt-8 text-center text-xs text-gray-400">
            En continuant, vous acceptez nos <a href="#" className="underline">Conditions d'utilisation</a>
          </p>
        </div>

        {/* Decorative elements */}
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
