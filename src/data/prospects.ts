export type UrgencyLevel = "urgent" | "chaud" | "tiede";

export interface Prospect {
  id: string;
  name: string;
  sector: string;
  city: string;
  neighborhood: string;
  needs: string[];
  signals: string[];
  matchScore: number;
  locked: boolean;
  phone?: string;
  email?: string;
  detectedNeed: string;
  isNew: boolean;
  argument: string;
}

export function getUrgencyLevel(score: number): UrgencyLevel {
  if (score >= 80) return "urgent";
  if (score >= 60) return "chaud";
  return "tiede";
}

export function getUrgencyConfig(level: UrgencyLevel) {
  switch (level) {
    case "urgent":
      return { emoji: "🔥", label: "Urgent", color: "text-red-500", bg: "bg-red-500", barClass: "bg-red-500" };
    case "chaud":
      return { emoji: "⚡", label: "Chaud", color: "text-orange-500", bg: "bg-orange-500", barClass: "bg-orange-500" };
    case "tiede":
      return { emoji: "✅", label: "Tiède", color: "text-green-500", bg: "bg-green-500", barClass: "bg-green-500" };
  }
}

export const prospects: Prospect[] = [
  {
    id: "1",
    name: "Clinique Saint-Michel",
    sector: "Santé privée",
    city: "Cotonou",
    neighborhood: "Cadjehoun",
    signals: ["Pas de site web", "Pas de réseaux sociaux"],
    needs: ["Développeur web", "Community manager"],
    matchScore: 95,
    locked: false,
    phone: "+229 21 30 31 32",
    email: "contact@saintmichel-clinique.bj",
    detectedNeed: "Développeur web + Community manager",
    isNew: true,
    argument: "Une clinique sans présence en ligne perd en moyenne 40% de patients potentiels qui cherchent un médecin sur Google. Proposez la création d'un site vitrine avec prise de RDV en ligne et une stratégie réseaux sociaux pour humaniser l'image de la clinique.",
  },
  {
    id: "2",
    name: "Hôtel Bel Azur",
    sector: "Hôtellerie",
    city: "Cotonou",
    neighborhood: "Fidjrossè",
    signals: ["Site non mobile", "Note 2.8/5 sur Google"],
    needs: ["Développeur web", "Community manager"],
    matchScore: 90,
    locked: false,
    phone: "+229 97 00 11 22",
    email: "reservation@belazur-hotel.com",
    detectedNeed: "Refonte site web + Gestion e-réputation",
    isNew: true,
    argument: "Avec une note de 2.8/5 et un site non responsive, cet hôtel perd des réservations face à la concurrence. 67% des voyageurs réservent depuis leur mobile. Proposez une refonte mobile-first et une stratégie de gestion des avis Google.",
  },
  {
    id: "3",
    name: "École Excellence Plus",
    sector: "Éducation privée",
    city: "Cotonou",
    neighborhood: "Akpakpa",
    signals: ["Recrutement actif", "Pas de réseaux sociaux"],
    needs: ["Community manager", "Designer"],
    matchScore: 88,
    locked: false,
    phone: "+229 61 22 33 44",
    email: "admin@excellence-plus.edu.bj",
    detectedNeed: "Community manager + Graphiste",
    isNew: false,
    argument: "L'école recrute activement mais n'a aucune présence sur les réseaux sociaux. Les parents d'élèves consultent Facebook et Instagram avant de choisir une école. Une stratégie de contenu éducatif pourrait augmenter les inscriptions de 30%.",
  },
  {
    id: "4",
    name: "Résidence Les Palmiers",
    sector: "Immobilier",
    city: "Cotonou",
    neighborhood: "Haie Vive",
    signals: ["Site non mobile", "Expansion récente"],
    needs: ["Développeur web", "Photographe"],
    matchScore: 82,
    locked: false,
    phone: "+229 95 66 77 88",
    email: "info@palm-residence.bj",
    detectedNeed: "Refonte site + Photographe immobilier",
    isNew: false,
    argument: "En pleine expansion, cette résidence a un site obsolète non adapté au mobile. Dans l'immobilier, 80% des recherches commencent en ligne. Des photos professionnelles et un site moderne peuvent accélérer la commercialisation de 50%.",
  },
  {
    id: "5",
    name: "Supermarché Vitamine",
    sector: "Grande distribution",
    city: "Cotonou",
    neighborhood: "Ganhi",
    signals: ["Pas de site web", "Note 3.1/5 sur Google"],
    needs: ["Développeur web", "Marketeur"],
    matchScore: 85,
    locked: true,
    phone: "+229 21 15 15 15",
    email: "dg@vitamine-market.bj",
    detectedNeed: "Création site e-commerce + Marketeur",
    isNew: true,
    argument: "Sans site web et avec une note moyenne de 3.1/5, ce supermarché laisse la concurrence capter ses clients en ligne. Un site e-commerce avec livraison pourrait générer 25% de revenus supplémentaires.",
  },
  {
    id: "6",
    name: "Cabinet Notaire Adjovi",
    sector: "Juridique",
    city: "Cotonou",
    neighborhood: "Plateau",
    signals: ["Pas de site web", "Pas de réseaux sociaux"],
    needs: ["Développeur web", "Rédacteur"],
    matchScore: 80,
    locked: true,
    phone: "+229 97 88 99 00",
    email: "etude@adjovi-notaire.bj",
    detectedNeed: "Développeur web + Rédacteur",
    isNew: false,
    argument: "Un cabinet notarial sans présence en ligne perd la clientèle jeune et connectée. Un site avec blog juridique positionnerait le cabinet comme référence et générerait des consultations entrantes.",
  },
  {
    id: "7",
    name: "Concessionnaire AutoPlus",
    sector: "Automobile",
    city: "Cotonou",
    neighborhood: "Akpakpa",
    signals: ["Site non mobile", "Recrutement actif"],
    needs: ["Développeur web", "Photographe"],
    matchScore: 78,
    locked: true,
    phone: "+229 90 44 55 66",
    email: "ventes@autoplus-benin.bj",
    detectedNeed: "Refonte site + Photographe produit",
    isNew: false,
    argument: "Le site non mobile empêche les acheteurs de consulter le catalogue de véhicules depuis leur téléphone. Le recrutement actif montre une croissance — c'est le moment idéal pour investir dans le digital.",
  },
  {
    id: "8",
    name: "Restaurant Le Diplomate",
    sector: "Restauration haut de gamme",
    city: "Cotonou",
    neighborhood: "Centre",
    signals: ["Note 2.9/5 sur Google", "Pas de réseaux sociaux"],
    needs: ["Community manager", "Photographe"],
    matchScore: 75,
    locked: true,
    phone: "+229 66 33 22 11",
    email: "contact@le-diplomate.bj",
    detectedNeed: "Community manager + Photographe culinaire",
    isNew: false,
    argument: "Avec une note de 2.9/5 et aucune présence sociale, ce restaurant haut de gamme ne capitalise pas sur son positionnement. Des photos culinaires professionnelles et une gestion active des avis pourraient transformer sa réputation en ligne.",
  },
];

export const skillOptions = [
  "Développement Web",
  "Design UI/UX",
  "Graphisme",
  "SEO",
  "Marketing Digital",
  "Community Management",
  "Rédaction Web",
  "Photographie",
  "Vidéo",
  "Branding",
  "E-commerce",
  "Application Mobile",
  "WordPress",
];

export const cityOptions = [
  "Cotonou",
  "Porto-Novo",
  "Parakou",
  "Abomey-Calavi",
  "Djougou",
  "Bohicon",
  "Ouidah",
  "Natitingou",
  "Lokossa",
  "Kandi",
];

export const sectorOptions = [
  "Santé privée",
  "Hôtellerie",
  "Éducation privée",
  "Immobilier",
  "Grande distribution",
  "Juridique",
  "Automobile",
  "Restauration haut de gamme",
];

export const needFilterOptions = [
  "Développeur web",
  "Designer",
  "Marketeur",
  "Photographe",
  "Rédacteur",
  "Community manager",
];
