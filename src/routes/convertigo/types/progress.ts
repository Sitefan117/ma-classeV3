import type { BeltId } from './exercise';

export interface BeltProgress {
  practiceBest: number;
  validated: boolean;
  bossDefeated: boolean;
}

export interface PlayerProgress {
  xp: number;
  level: number;
  belts: Record<string, BeltProgress>;
}
