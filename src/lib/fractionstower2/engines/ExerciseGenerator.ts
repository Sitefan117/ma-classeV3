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

export interface ExerciseRequest {
	floorId: string;
	difficulty: 'easy' | 'medium' | 'hard';
	type: 'standard' | 'comparison';
	index: number;
}

export interface Exercise {
	question: string;
	correctAnswer: Fraction | string;
	type: 'input' | 'comparison';
	hint?: string;
	fractions?: Fraction[]; // Ajouté pour l'aide visuelle (Boss/Comparaisons)
}

export class ExerciseGenerator {
	/**
	 * Génère une fraction aléatoire basée sur une configuration.
	 */
	static generateRandomFraction(config: ExerciseConfig): Fraction {
		const den = config.denominators[Math.floor(Math.random() * config.denominators.length)];
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
	 * POINT D'ENTRÉE PRINCIPAL pour les activités et le Boss.
	 */
	static generate(request: ExerciseRequest): Exercise {
		const { floorId, difficulty, type } = request;
		
		const configs: Record<string, ExerciseConfig> = {
			'floor-1': { minNumerator: 1, maxNumerator: 10, denominators: [2, 3, 4, 6, 8] },
			'floor-2': { minNumerator: 1, maxNumerator: 20, denominators: [5, 10, 20] },
			'floor-3': { minNumerator: 1, maxNumerator: 10, denominators: [4, 8, 12] },
			'floor-4': { minNumerator: 1, maxNumerator: 100, denominators: [10, 100] },
			'floor-5': { minNumerator: 1, maxNumerator: 100, denominators: [10, 100, 1000] },
			'floor-6': { minNumerator: 1, maxNumerator: 1000, denominators: [100, 1000] },
			'floor-7': { minNumerator: 1, maxNumerator: 100, denominators: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
			'floor-8': { minNumerator: 1, maxNumerator: 1000, denominators: [10, 100, 1000] },
		};

		const config = configs[floorId] || configs['floor-1'];

		if (type === 'comparison') {
			const f1 = this.generateRandomFraction(config);
			const f2 = this.generateRandomFraction(config);
			
			const val1 = f1.numerator / f1.denominator;
			const val2 = f2.numerator / f2.denominator;
			
			// FIX: On retourne maintenant le symbole correct (<, >, =) 
			// pour correspondre aux boutons de l'UI
			let result = '=';
			if (val1 > val2) result = '>';
			else if (val1 < val2) result = '<';

			if (difficulty === 'hard' && Math.random() > 0.5) {
				return {
					question: `Compare : ${f1.numerator}/${f1.denominator} et ${f2.numerator}/${f2.denominator}`,
					correctAnswer: result,
					type: 'comparison',
					fractions: [f1, f2]
				};
			}

			return {
				question: `Lequel est le plus grand ? ${f1.numerator}/${f1.denominator} ou ${f2.numerator}/${f2.denominator}`,
				correctAnswer: result,
				type: 'comparison',
				fractions: [f1, f2]
			};
		}

		const f = this.generateRandomFraction(config);
		return {
			question: `Saisis la fraction : ${f.numerator}/${f.denominator}`,
			correctAnswer: f,
			type: 'input',
			fractions: [f]
		};
	}

	static generateSet(count: number, config: ExerciseConfig): Fraction[] {
		const set: Fraction[] = [];
		for (let i = 0; i < count; i++) {
			set.push(this.generateRandomFraction(config));
		}
		return set;
	}
}
