import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  prospects,
  Prospect,
  getUrgencyLevel,
  getUrgencyConfig,
  sectorOptions,
  needFilterOptions,
} from "@/data/prospects";
import {
  MapPin,
  Sparkles,
  Lock,
  Crown,
  ArrowUpRight,
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  RotateCcw,
  Phone,
  Mail,
  AlertTriangle,
  Bot
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Prospects = () => {
  const navigate = useNavigate();
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [needFilter, setNeedFilter] = useState<string>("all");
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  const filtered = prospects.filter((p) => {
    if (urgencyFilter !== "all") {
      const level = getUrgencyLevel(p.matchScore);
      if (urgencyFilter !== level) return false;
    }
    if (sectorFilter !== "all" && p.sector !== sectorFilter) return false;
    if (needFilter !== "all" && !p.needs.some((n) => n.toLowerCase().includes(needFilter.toLowerCase()))) return false;
    return true;
  });

  const resetFilters = () => {
    setUrgencyFilter("all");
    setSectorFilter("all");
    setNeedFilter("all");
  };

  const hasFilters = urgencyFilter !== "all" || sectorFilter !== "all" || needFilter !== "all";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <DashboardLayout hideDashboard onBack={() => navigate("/onboarding")}>
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
          {/* Stats */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Opportunités <Sparkles className="text-yellow-400 h-8 w-8" />
            </h1>
            <p className="mt-2 text-white/50 font-medium">Prospects détectés par notre IA dans votre zone de recherche</p>
          </div>

          <div className="mb-10 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Prospects trouvés", value: String(prospects.length), icon: Users, change: "+3 aujourd'hui", color: "text-[#6366F1]" },
              { label: "Messages envoyés", value: "2", icon: MessageSquare, change: "cette semaine", color: "text-green-400" },
              { label: "Score moyen", value: Math.round(prospects.reduce((a, p) => a + p.matchScore, 0) / prospects.length) + "%", icon: TrendingUp, change: "+5% vs hier", color: "text-amber-400" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/5 bg-[#1a1a2e] p-6 shadow-xl hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</span>
                  <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                <p className="mt-1 text-xs text-white/30 font-medium">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-[180px] bg-transparent border-white/10 text-white rounded-xl">
                <SelectValue placeholder="Score d'urgence" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                <SelectItem value="all">Tous les scores</SelectItem>
                <SelectItem value="urgent">🔥 Urgent (80+)</SelectItem>
                <SelectItem value="chaud">⚡ Chaud (60-79)</SelectItem>
                <SelectItem value="tiede">✅ Tiède (40-59)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-[200px] bg-transparent border-white/10 text-white rounded-xl">
                <SelectValue placeholder="Secteur" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                <SelectItem value="all">Tous les secteurs</SelectItem>
                {sectorOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={needFilter} onValueChange={setNeedFilter}>
              <SelectTrigger className="w-[200px] bg-transparent border-white/10 text-white rounded-xl">
                <SelectValue placeholder="Besoin" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                <SelectItem value="all">Tous les besoins</SelectItem>
                {needFilterOptions.map((n) => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-white/40 hover:text-white hover:bg-white/5">
                <RotateCcw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Prospect Cards */}
          <div className="grid gap-6 md:grid-cols-2 pb-20">
            {filtered.map((p) => {
              const level = getUrgencyLevel(p.matchScore);
              const config = getUrgencyConfig(level);

              return (
                <div
                  key={p.id}
                  className={`group relative rounded-[2rem] border border-white/5 bg-[#1a1a2e] p-6 transition-all hover:border-[#6366F1]/40 hover:shadow-2xl hover:shadow-indigo-500/10 ${p.locked ? "overflow-hidden" : ""}`}
                >
                  {p.locked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-md">
                      <div className="p-4 rounded-full bg-white/5 mb-4">
                        <Lock className="h-6 w-6 text-[#6366F1]" />
                      </div>
                      <p className="mb-4 text-sm font-bold text-white/60">Opportunité Premium verrouillée</p>
                      <Link to="/pricing">
                        <Button className="bg-[#6366F1] hover:bg-[#8B5CF6] text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-indigo-500/30">
                          <Crown className="mr-2 h-4 w-4" />
                          Passer en mode PRO
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#6366F1] transition-colors">{p.name}</h3>
                        {p.isNew && (
                          <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-sm text-white/40 font-medium">
                        <span className="px-2 py-0.5 bg-white/5 rounded-md">{p.sector}</span>
                        <div className="flex items-center gap-1.5 underline decoration-white/10 underline-offset-4">
                          <MapPin className="h-3.5 w-3.5 text-[#6366F1]" />
                          {p.city}, {p.neighborhood}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${config.bg}/20 border border-${config.color}/20`}>
                        <span className={`text-lg font-black ${config.color}`}>{p.matchScore}</span>
                      </div>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-tighter">{config.emoji} {config.label}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <Progress value={p.matchScore} className="h-2 bg-white/5 overflow-hidden rounded-full">
                      <div className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all" style={{ width: `${p.matchScore}%` }} />
                    </Progress>
                  </div>

                  {/* Detected need */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">
                    <p className="text-[10px] font-black text-[#6366F1] uppercase tracking-widest mb-1">Besoin prioritaire</p>
                    <p className="text-sm text-white/90 font-semibold italic">"{p.detectedNeed}"</p>
                  </div>

                  {/* Signals & Budget */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {p.signals.slice(0, 2).map((signal) => (
                          <Badge key={signal} variant="secondary" className="bg-white/5 text-white/60 border-0 text-[10px] px-2 py-0.5 rounded-lg">
                            {signal}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        {p.phone && (
                          <div className="flex items-center gap-2 text-xs text-white/40 font-bold">
                            <Phone className="h-3.5 w-3.5 text-[#6366F1]" />
                            {p.locked ? (
                              <span>+229 •• •• •• ••</span>
                            ) : (
                              <a href={`tel:${p.phone.replace(/\s+/g, '')}`} className="text-white hover:text-[#6366F1] transition-colors">
                                {p.phone}
                              </a>
                            )}
                          </div>
                        )}
                        {p.email && (
                          <div className="flex items-center gap-2 text-xs text-white/40 font-bold">
                            <Mail className="h-3.5 w-3.5 text-[#6366F1]" />
                            {p.locked ? (
                              <span>••••••••@••••.bj</span>
                            ) : (
                              <a href={`mailto:${p.email}`} className="text-white hover:text-[#6366F1] transition-colors">
                                {p.email}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex gap-3">
                    <Link to="/messages" className="flex-1">
                      <Button className="w-full bg-[#6366F1] hover:bg-[#8B5CF6] text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-indigo-500/10">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Générer le message
                        <ArrowUpRight className="ml-auto h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedProspect(p)}
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10 h-12 w-12 rounded-xl"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="p-6 rounded-full bg-white/5 mb-6">
                <AlertTriangle className="h-12 w-12 text-white/20" />
              </div>
              <p className="text-xl font-bold text-white">Aucun prospect trouvé</p>
              <p className="text-white/40 mt-2">Essayez de modifier vos filtres pour voir plus d'opportunités.</p>
              <Button variant="link" onClick={resetFilters} className="mt-4 text-[#6366F1] font-bold">Réinitialiser les filtres</Button>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <Dialog open={!!selectedProspect} onOpenChange={() => setSelectedProspect(null)}>
          <DialogContent className="sm:max-w-lg bg-[#1a1a2e] border-white/10 text-white rounded-[2rem] p-8">
            {selectedProspect && (() => {
              const level = getUrgencyLevel(selectedProspect.matchScore);
              const config = getUrgencyConfig(level);
              return (
                <>
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black flex items-center gap-3">
                      {config.emoji} Analyse d'urgence — {selectedProspect.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Score de correspondance</p>
                        <span className={`text-2xl font-black ${config.color}`}>{selectedProspect.matchScore}%</span>
                      </div>
                      <Progress value={selectedProspect.matchScore} className="h-3 bg-white/10 rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Contact Phone</p>
                        <p className="text-sm font-bold text-white">{selectedProspect.locked ? "+229 •• •• •• ••" : selectedProspect.phone}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Localisation</p>
                        <p className="text-sm font-bold text-white">{selectedProspect.neighborhood}, {selectedProspect.city}</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
                      <p className="text-[10px] font-black text-[#6366F1] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Bot className="h-4 w-4" /> Argument clé d'approche IA
                      </p>
                      <p className="text-sm text-white/90 leading-relaxed font-medium italic">"{selectedProspect.argument}"</p>
                    </div>

                    <Link to="/messages">
                      <Button className="w-full bg-[#6366F1] hover:bg-[#8B5CF6] text-white font-bold h-14 rounded-2xl shadow-xl shadow-indigo-500/20">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Générer un message personnalisé
                      </Button>
                    </Link>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </div>
  );
};

export default Prospects;
