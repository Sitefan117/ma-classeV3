import type { PlayerProgress } from '../types/progress';

const STORAGE_KEY = 'numeria_convertigo_progress';

const DEFAULT_PROGRESS: PlayerProgress = {
  xp: 0,
  level: 1,
  unlockedSkills: ['length_basic']
};

export function loadProgress(): PlayerProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return JSON.parse(raw) as PlayerProgress;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: PlayerProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Erreur de sauvegarde Convertigo:', err);
  }
}

export function resetProgress(): PlayerProgress {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_PROGRESS;
}