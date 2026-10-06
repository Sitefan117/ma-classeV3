// -----------------------------------------------------------------------------
// RÔLE DU FICHIER : BossManager.ts
// Gestionnaire des combats de Boss de Synthèse (Étage 5 et Étage 8).
// -----------------------------------------------------------------------------

import { ExerciseGenerator, type DynamicExercise } from '../engines/ExerciseGenerator';

export class BossManager {
  // Génère une question de synthèse basée sur une compétence aléatoire inférieure ou égale à maxFloor
  public static generateBossPhase(maxFloor: number): DynamicExercise {
    const availableCompetencies = [];
    if (maxFloor >= 5) availableCompetencies.push('frac_01', 'frac_02', 'frac_03', 'frac_04');
    if (maxFloor >= 8) availableCompetencies.push('frac_05', 'frac_06', 'frac_07');

    const randomComp = availableCompetencies[Math.floor(Math.random() * availableCompetencies.length)];
    const exercise = ExerciseGenerator.generate(randomComp);

    return {
      ...exercise,
      type: 'boss_battle',
      title: maxFloor >= 8 ? '👑 BOSS FINAL : Maître Suprême' : '⚔ BOSS DE SYNTHÈSE (Étages 1 à 4)',
      instruction: `[Phase de Synthèse] ${exercise.instruction}`
    };
  }
}
