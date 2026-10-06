export interface TileObject {
  x: number;
  y: number;
  type: string;
}

export interface HouseData {
  id: string;
  name: string;
  belt: 'white' | 'yellow' | 'green' | 'blue' | 'black';
  x: number;
  y: number;
  doorX: number;
  doorY: number;
  description: string;
}

export interface NPCData {
  id: string;
  name: string;
  x: number;
  y: number;
  dialogue: string;
}

// Grille 20 colonnes x 15 lignes
export const GRID_COLS = 20;
export const GRID_ROWS = 15;
export const TILE_SIZE = 36; // 36px par case = 720x540px total

// 0 = Marche possible, 1 = Obstacle (Arbre, Eau, Mur), 2 = Interaction (Porte, PNJ, Panneau)
export const COLLISION_GRID: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  [1, 0, 1, 2, 1, 0, 0, 2, 0, 0, 0, 1, 2, 1, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 0, 1, 0, 2, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Rivière / Pont
  [1, 0, 0, 1, 2, 1, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 0, 2, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export const HOUSES: HouseData[] = [
  { id: 'white', name: 'Maison Blanche', belt: 'white', x: 3, y: 1, doorX: 3, doorY: 2, description: 'Ceinture Blanche : Découvrir les unités de mesure.' },
  { id: 'yellow', name: 'Maison Jaune', belt: 'yellow', x: 12, y: 1, doorX: 12, doorY: 2, description: 'Ceinture Jaune : Construire le tableau de conversion.' },
  { id: 'green', name: 'Maison Verte', belt: 'green', x: 7, y: 5, doorX: 7, doorY: 6, description: 'Ceinture Verte : Distinguer longueurs, masses et capacités.' },
  { id: 'blue', name: 'Maison Bleue', belt: 'blue', x: 4, y: 9, doorX: 4, doorY: 10, description: 'Ceinture Bleue : Mesurer et effectuer des conversions simples.' },
  { id: 'black', name: 'Maison Noire', belt: 'black', x: 11, y: 9, doorX: 11, doorY: 10, description: 'Ceinture Noire : Maîtriser tous les défis de conversion !' }
];

export const NPCS: NPCData[] = [
  { id: 'guide', name: 'Professeur Conversion', x: 7, y: 7, dialogue: 'Bienvenue dans Convertigo ! Explore les 5 maisons des ceintures pour progresser.' },
  { id: 'assistant', name: 'Assistant', x: 12, y: 6, dialogue: 'N’oublie pas d’utiliser le tableau de conversion en cas de doute !' }
];