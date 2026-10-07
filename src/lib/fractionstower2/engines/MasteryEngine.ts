// -----------------------------------------------------------------------------
// MOTEUR DE MAÎTRISE
// Suit la progression de l'élève et détermine le niveau de maîtrise.
// -----------------------------------------------------------------------------

export type MasteryLevel = 'RED' | 'ORANGE' | 'GREEN';

export interface CompetenceState {
	successes: number;
	failures: number;
	lastStatus: MasteryLevel;
	history: Array<{ date: number; result: boolean; errorType?: string }>;
}

export class MasteryEngine {
	/**
	 * Calcule le nouveau niveau de maîtrise basé sur les tentatives.
	 */
	static calculateLevel(state: CompetenceState): MasteryLevel {
		const total = state.successes + state.failures;
		if (total < 3) return 'RED'; // Pas assez de données
		
		const ratio = state.successes / total;
		if (ratio >= 0.8) return 'GREEN';
		if (ratio >= 0.5) return 'ORANGE';
		return 'RED';
	}

	/**
	 * Met à jour l'état d'une compétence après un exercice.
	 */
	static updateCompetence(state: CompetenceState, success: boolean, errorType?: string): CompetenceState {
		const newState = { ...state };
		if (success) {
			newState.successes += 1;
		} else {
			newState.failures += 1;
		}
		
		newState.history.push({
			date: Date.now(),
			result: success,
			errorType
		});

		newState.lastStatus = this.calculateLevel(newState);
		return newState;
	}
}
