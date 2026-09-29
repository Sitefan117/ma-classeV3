import type { PlayerProgress } from '../types/progress';

const STORAGE_KEY = 'convertigo_rpg_progress_v1';

const emptyBelt = () => ({
  practiceBest: 0,
  validated: false,
  bossDefeated: false
});

export function defaultProgress(): PlayerProgress {
  const belts: Record<string, ReturnType<typeof emptyBelt>> = {};
  for (const grade of ['7H', '8H']) {
    for (const belt of ['white', 'yellow', 'green', 'blue', 'black']) {
      belts[`${grade}:${belt}`] = emptyBelt();
    }
  }
  return { xp: 0, level: 1, belts };
}

export function loadProgress(): PlayerProgress {
  if (typeof window === 'undefined') return defaultProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();

    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    const base = defaultProgress();

    return {
      xp: typeof parsed.xp === 'number' ? parsed.xp : base.xp,
      level: typeof parsed.level === 'number' ? parsed.level : base.level,
      belts: { ...base.belts, ...(parsed.belts ?? {}) }
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: PlayerProgress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function beltKey(grade: string, belt: string) {
  return `${grade}:${belt}`;
}
