export interface LabModule {
  id: string;
  title: string;
  subject: string;       // ex: "Mathématiques", "Français", "Sciences"
  domain: string;        // ex: "Espace", "Nombres", "Conjugaison"
  description: string;
  level: string;         // ex: "8H", "9H", "10H"
  duration?: string;     // ex: "15 min"
  isInteractive: boolean;
  href: string;          // Chemin vers le fichier HTML/Svelte autonome
  gameLink?: {
    title: string;
    route: string;
  };
}

export const labModules: LabModule[] = [
  {
    id: "croquis-solides",
    title: "Construire un croquis de solide",
    subject: "Mathématiques",
    domain: "Espace",
    description: "Apprendre à représenter des solides en perspective cavalière et identifier faces, arêtes et sommets.",
    level: "8H",
    duration: "20 min",
    isInteractive: true,
    href: "/learning-lab/mathematiques/espace/croquis.html",
    gameLink: {
      title: "Geom Fighter",
      route: "/geom-fighter"
    }
  },
  {
    id: "solides-3d",
    title: "Les Solides usuels",
    subject: "Mathématiques",
    domain: "Espace",
    description: "Découvrir la classification des prismes, pyramides et corps de révolution.",
    level: "8H",
    duration: "15 min",
    isInteractive: true,
    href: "/learning-lab/mathematiques/espace/solides.html"
  },
  {
    id: "fractions-intro",
    title: "Introduction aux fractions",
    subject: "Mathématiques",
    domain: "Nombres",
    description: "Visualiser et manipuler les partages d'unités de manière interactive.",
    level: "9H",
    duration: "25 min",
    isInteractive: true,
    href: "/learning-lab/mathematiques/nombres/fractions.html"
  },
  {
    id: "present-indicatif",
    title: "Le Présent de l'Indicatif",
    subject: "Français",
    domain: "Conjugaison",
    description: "Maîtriser les terminaisons des 1er, 2e et 3e groupes avec exercices autocorrectifs.",
    level: "8H",
    duration: "20 min",
    isInteractive: true,
    href: "/learning-lab/francais/conjugaison/present.html",
    gameLink: {
      title: "Conju Fighter",
      route: "/conju-fighter"
    }
  }
];