export type TileType = 
  | 'grass'
  | 'path'
  | 'water'
  | 'tree'
  | 'rock'
  | 'fence'
  | 'bridge'
  | 'house_wall'
  | 'door'
  | 'npc';

export interface HouseData {
  id: string; // 'white' | 'yellow' | 'green' | 'blue' | 'black'
  belt: 'white' | 'yellow' | 'green' | 'blue' | 'black';
  name: string;
  doorX: number;
  doorY: number;
}

export interface NPCData {
  id: string;
  name: string;
  x: number;
  y: number;
  dialogue: string[];
}