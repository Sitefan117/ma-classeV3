// -----------------------------------------------------------------------------
// GÉNÉRATEUR D'EXERCICES
// Génère dynamiquement des fractions et des défis basés sur des critères 
// de difficulté et des objectifs pédagogiques.
// -----------------------------------------------------------------------------

import { type Fraction } from '$lib/fractionstower2/engines/FractionEngine';

export interface ExerciseConfig {
	minNumerator: number;
	maxNumerator: number;
	denominators: number[]; // Liste des dénominateurs autorisés (ex: [2, 4, 8])
}

export class ExerciseGenerator {
	/**
	 * Génère une fraction aléatoire basée sur une configuration.
	 * IMPORTANT : Le numérateur est toujours <= au dénominateur pour les exercices de base.
	 */
	static generateRandomFraction(config: ExerciseConfig): Fraction {
		const den = config.denominators[Math.floor(Math.random() * config.denominators.length)];
		
		// On s'assure que le numérateur ne dépasse jamais le dénominateur
		const actualMax = Math.min(config.maxNumerator, den);
		const num = Math.floor(Math.random() * (actualMax - config.minNumerator + 1)) + config.minNumerator;
		
		return { numerator: num, denominator: den };
	}

	/**
	 * Génère une fraction équivalente à une autre.
	 */
	static generateEquivalent(fraction: Fraction, factor: number = 2): Fraction {
		return {
			numerator: fraction.numerator * factor,
			denominator: fraction.denominator * factor
		};
	}

	/**
	 * Génère un ensemble de fractions pour un exercice d'ordonnancement.
	 */
	static generateSet(count: number, config: ExerciseConfig): Fraction[] {
		const set: Fraction[] = [];
		for (let i = 0; i < count; i++) {
			set.push(this.generateRandomFraction(config));
		}
		return set;
	}
}
