export const TILE_SIZE = 36;
export const GRID_COLS = 20;
export const GRID_ROWS = 15;

export type TileType = 'G' | 'F' | 'P' | 'W' | 'B' | 'T' | 'H' | 'D' | 'N';

// SOURCE DE VÉRITÉ POUR LES COLLISIONS.
export const TILE_MAP: TileType[][] = [
  ['T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T'],
  ['T','G','F','G','T','H','H','H','T','G','G','T','H','H','H','T','F','G','G','T'],
  ['T','G','N','P','T','H','H','H','T','G','G','T','H','H','H','T','G','G','G','T'],
  ['T','P','P','P','P','H','D','H','P','P','P','P','H','D','H','P','P','P','G','T'],
  ['T','P','G','G','P','P','P','P','P','P','P','P','P','P','P','P','G','P','G','T'],
  ['T','P','G','G','P','G','G','G','P','P','G','G','G','G','G','P','G','P','G','T'],
  ['T','P','G','G','P','G','T','H','H','H','T','G','G','G','G','P','G','P','G','T'],
  ['T','P','G','G','P','G','T','H','H','H','T','G','F','G','G','P','G','P','G','T'],
  ['T','P','G','G','P','P','P','H','D','H','P','P','P','P','P','P','P','P','G','T'],
  ['T','W','W','W','W','W','W','P','B','B','P','W','W','W','W','W','W','W','W','T'],
  ['T','G','F','G','G','G','G','P','P','P','P','G','G','G','G','G','G','F','G','T'],
  ['T','G','G','G','T','H','H','H','T','G','T','H','H','H','T','G','G','G','G','T'],
  ['T','G','G','G','T','H','D','H','T','G','T','H','D','H','T','G','G','G','G','T'],
  ['T','G','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','G','G','T'],
  ['T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T']
];

export const DOOR_MAPPING: Record<string, string> = {
  '6,3': 'white',
  '13,3': 'yellow',
  '8,8': 'green',
  '6,12': 'blue',
  '12,12': 'black'
};

export const HOUSE_INFO = [
  { id: 'white', x: 5, y: 1, label: 'Ceinture Blanche', subtitle: 'Découvrir', doorRow: 2 as const },
  { id: 'yellow', x: 12, y: 1, label: 'Ceinture Jaune', subtitle: 'Construire', doorRow: 2 as const },
  { id: 'green', x: 7, y: 6, label: 'Ceinture Verte', subtitle: 'Distinguer', doorRow: 2 as const },
  { id: 'blue', x: 5, y: 11, label: 'Ceinture Bleue', subtitle: 'Mesurer', doorRow: 1 as const },
  { id: 'black', x: 11, y: 11, label: 'Ceinture Noire', subtitle: 'Maîtriser', doorRow: 1 as const }
];
