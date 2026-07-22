export interface ProgressionResult {
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
}

export function calculateXpGain(
  currentXp: number,
  currentLevel: number,
  usedHint: boolean
): ProgressionResult {
  // Gain de base : 20 XP sans indice, 10 XP avec indice
  const baseGain = usedHint ? 10 : 20;
  const newXp = currentXp + baseGain;

  // Calcul du niveau (ex: 100 XP par niveau)
  const newLevel = Math.floor(newXp / 100) + 1;
  const leveledUp = newLevel > currentLevel;

  return {
    newXp,
    newLevel,
    leveledUp
  };
}