import type { TileType, HouseData, NPCData } from '../types/map';

export const MAP_WIDTH = 24;
export const MAP_HEIGHT = 18;

// Grille de la carte (24 colonnes x 18 lignes)
// G: Grass, P: Path, T: Tree, W: Water, B: Bridge, R: Rock, F: Fence, H: House Wall, D: Door, N: NPC
export const MAP_GRID: TileType[][] = [
  ['T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T'],
  ['T','G','G','G','G','T','H','H','H','T','G','G','G','G','T','H','H','H','T','G','G','G','G','T'],
  ['T','G','G','G','G','T','H','H','H','T','G','G','G','G','T','H','H','H','T','G','G','G','G','T'],
  ['T','G','G','G','G','T','H','D','H','T','G','G','G','G','T','H','D','H','T','G','G','G','G','T'],
  ['T','G','G','G','G','P','P','P','P','P','P','P','P','P','P','P','P','P','G','G','G','G','G','T'],
  ['T','T','T','G','G','P','G','G','G','G','G','W','W','G','G','G','G','P','G','G','T','T','T','T'],
  ['T','H','H','H','G','P','G','G','G','G','G','W','W','G','G','G','G','P','G','H','H','H','G','T'],
  ['T','H','H','H','G','P','G','G','N','G','G','B','B','G','G','G','G','P','G','H','H','H','G','T'],
  ['T','H','D','H','G','P','G','G','G','G','G','W','W','G','G','G','G','P','G','H','D','H','G','T'],
  ['T','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','G','T'],
  ['T','G','G','G','G','P','G','G','G','G','G','W','W','G','G','G','G','P','G','G','G','G','G','T'],
  ['T','G','G','G','G','P','G','G','G','G','G','W','W','G','G','G','G','P','G','G','G','G','G','T'],
  ['T','G','G','G','G','P','G','G','G','G','G','W','W','T','H','H','H','P','G','G','G','G','G','T'],
  ['T','G','G','G','G','P','G','G','G','G','G','W','W','T','H','H','H','P','G','G','G','G','G','T'],
  ['T','G','G','G','G','P','P','P','P','P','P','B','B','P','P','D','H','P','G','G','G','G','G','T'],
  ['T','G','G','G','G','G','G','G','G','G','G','W','W','G','G','P','P','P','G','G','G','G','G','T'],
  ['T','R','R','G','G','G','G','G','G','G','G','W','W','G','G','G','G','G','G','G','R','R','G','T'],
  ['T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T'],
];

export const HOUSES: Record<string, HouseData> = {
  white: {
    id: 'white',
    belt: 'white',
    name: 'Maison Blanche — Découvrir',
    doorX: 7,
    doorY: 3,
  },
  yellow: {
    id: 'yellow',
    belt: 'yellow',
    name: 'Maison Jaune — Construire',
    doorX: 17,
    doorY: 3,
  },
  green: {
    id: 'green',
    belt: 'green',
    name: 'Maison Verte — Distinguer',
    doorX: 2,
    doorY: 8,
  },
  blue: {
    id: 'blue',
    belt: 'blue',
    name: 'Maison Bleue — Mesurer',
    doorX: 20,
    doorY: 8,
  },
  black: {
    id: 'black',
    belt: 'black',
    name: 'Manoir Noir — Maîtriser',
    doorX: 15,
    doorY: 14,
  },
};

export const GUIDE_NPC: NPCData = {
  id: 'guide_archibald',
  name: 'Archibald le Sage',
  x: 8,
  y: 7,
  dialogue: [
    "Bienvenue dans le royaume de Convertigo !",
    "Je suis Archibald. Pour apprendre les grandeurs et mesures, explore le village.",
    "Chaque maison correspond à une Ceinture de compétence :",
    "• Blanche : Découvrir",
    "• Jaune : Construire",
    "• Verte : Distinguer",
    "• Bleue : Mesurer",
    "• Noire : Maîtriser le grand défi !",
    "Marche directement sur la porte d'une maison pour y entrer."
  ],
};