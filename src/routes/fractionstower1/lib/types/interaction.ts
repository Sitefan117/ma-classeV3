import type { BoundingBox } from './world';

export type InteractionType = 
  | 'door'
  | 'stairs'
  | 'elevator'
  | 'npc'
  | 'mission_zone'
  | 'course_zone'
  | 'boss_zone';

export interface InteractionZone extends BoundingBox {
  id: string;
  type: InteractionType;
  label: string;
  targetMapId?: string;
  targetSpawn?: { x: number; y: number };
  targetFloor?: number;
  competencyId?: string;
  dialogue?: string[];
  actionPrompt?: string;
}