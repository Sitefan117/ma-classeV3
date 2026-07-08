export type WorldId = 'livrets' | 'geometrie' | 'calculs' | 'numeria' | 'pcp';

export const worlds: Array<{
  id: WorldId;
  title: string;
  subtitle: string;
  route: string;
  emoji: string;
  color: string;
}> = [
  {
    id: 'livrets',
    title: "L'Atelier des Livrets",
    subtitle: 'Défis de tables de multiplication avec aides visuelles.',
    route: '/livrets',
    emoji: '✖️',
    color: 'indigo'
  },
  {
    id: 'geometrie',
    title: 'Le Défi des Formes',
    subtitle: 'Identification, intrus visuels et tri 2D/3D.',
    route: '/geometrie',
    emoji: '📐',
    color: 'emerald'
  },
  {
    id: 'calculs',
    title: 'Le Calcul Décimal',
    subtitle: 'Opérations décimales avec ardoise tactique.',
    route: '/calculs',
    emoji: '🔢',
    color: 'rose'
  },
  {
    id: 'numeria',
    title: 'Les Royaumes de Numéria',
    subtitle: 'Quête de numération HarmoS, étoiles et codex.',
    route: '/numeria',
    emoji: '📜',
    color: 'purple'
  },
  {
    id: 'pcp',
    title: 'Espace PCP / Orientation',
    subtitle: 'CV, lettre de motivation et projet professionnel.',
    route: '/pcp',
    emoji: '💼',
    color: 'amber'
  }
];

export const worldLabels: Record<WorldId, string> = {
  livrets: "L'Atelier des Livrets",
  geometrie: 'Le Défi des Formes',
  calculs: 'Le Calcul Décimal',
  numeria: 'Les Royaumes de Numéria',
  pcp: 'Espace PCP / Orientation'
};
