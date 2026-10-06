// -----------------------------------------------------------------------------
// RÔLE DU FICHIER : MasteryEngine.ts
// Gestion de la maîtrise des compétences, suivi du taux de réussite et réactivation.
// -----------------------------------------------------------------------------

export type MasteryStatus = 'mastered' | 'consolidating' | 'needs_review';

export interface CompetencyProgress {
  competencyId: string;
  successCount: number;
  errorCount: number;
  status: MasteryStatus;
  lastAttempt: number;
}

export class MasteryEngine {
  private static storageKey = 'fraction_tower_mastery';

  public static getProgress(competencyId: string): CompetencyProgress {
    const data = localStorage.getItem(this.storageKey);
    const allProgress: Record<string, CompetencyProgress> = data ? JSON.parse(data) : {};

    return allProgress[competencyId] || {
      competencyId,
      successCount: 0,
      errorCount: 0,
      status: 'needs_review',
      lastAttempt: Date.now()
    };
  }

  public static recordAttempt(competencyId: string, isSuccess: boolean): CompetencyProgress {
    const current = this.getProgress(competencyId);
    
    if (isSuccess) {
      current.successCount += 1;
    } else {
      current.errorCount += 1;
    }

    current.lastAttempt = Date.now();

    // Calcul du statut de maîtrise (Phase 6 du Prompt Maître)
    const total = current.successCount + current.errorCount;
    const ratio = current.successCount / (total || 1);

    if (current.successCount >= 10 && ratio >= 0.8) {
      current.status = 'mastered'; // 🟢 Maîtrisé
    } else if (current.successCount >= 5 || ratio >= 0.5) {
      current.status = 'consolidating'; // 🟠 Consolidation
    } else {
      current.status = 'needs_review'; // 🔴 À reprendre
    }

    // Sauvegarde locale
    const data = localStorage.getItem(this.storageKey);
    const allProgress: Record<string, CompetencyProgress> = data ? JSON.parse(data) : {};
    allProgress[competencyId] = current;
    localStorage.setItem(this.storageKey, JSON.stringify(allProgress));

    return current;
  }
}