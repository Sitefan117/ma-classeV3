// -----------------------------------------------------------------------------
// TYPES D'INTERACTION
// Définitions des types pour les zones d'interaction (portes, escaliers, ascenseurs).
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// RÔLE DU FICHIER : TYPES D'INTERACTION
// Définitions des déclencheurs et zones d'interaction (Layer 3) permettant au
// joueur d'interagir avec les éléments du monde (portes, escaliers, boss, etc.).
// -----------------------------------------------------------------------------

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