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
	type: 'standard' | 'comparison' | 'number_line' | 'decimal_conversion';
	index: number;
}

export interface Exercise {
	question: string;
	correctAnswer: Fraction | string;
	type: 'input' | 'comparison' | 'number_line' | 'decimal_conversion';
	hint?: string;
	fractions?: Fraction[];
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
	 * POINT D'ENTRÉE PRINCIPAL pour les activités et le Boss.
	 */
	static generate(request: ExerciseRequest): Exercise {
		const { floorId, difficulty, type } = request;
		
		// Configuration des dénominateurs par étage pour coller à la progression
		const configs: Record<string, ExerciseConfig> = {
			'floor-1': { minNumerator: 1, maxNumerator: 10, denominators: [2, 3, 4, 6, 8] }, // Bases
			'floor-2': { minNumerator: 1, maxNumerator: 10, denominators: [2, 3, 4, 5, 10] }, // Droite graduée
			'floor-3': { minNumerator: 1, maxNumerator: 10, denominators: [10, 100] },     // Surfaces décimales
			'floor-4': { minNumerator: 1, maxNumerator: 100, denominators: [10, 100] },    // Fractions décimales
			'floor-5': { minNumerator: 1, maxNumerator: 100, denominators: [10, 100] },    // Pont décimal (conversion)
			'floor-6': { minNumerator: 1, maxNumerator: 100, denominators: [10, 100, 1000] }, // Décomposition millièmes
			'floor-7': { minNumerator: 1, maxNumerator: 100, denominators: [2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Comparaison
			'floor-8': { minNumerator: 1, maxNumerator: 100, denominators: [2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Expertise
		};

		const config = configs[floorId] || configs['floor-1'];

		// 1. CAS COMPARAISON (Étages 7 & 8)
		if (type === 'comparison') {
			const f1 = this.generateRandomFraction(config);
			const f2 = this.generateRandomFraction(config);
			const val1 = f1.numerator / f1.denominator;
			const val2 = f2.numerator / f2.denominator;
			
			let result = '=';
			if (val1 > val2) result = '>';
			else if (val1 < val2) result = '<';

			return {
				question: `Compare : ${f1.numerator}/${f1.denominator} et ${f2.numerator}/${f2.denominator}`,
				correctAnswer: result,
				type: 'comparison',
				fractions: [f1, f2]
			};
		}

		// 2. CAS CONVERSION (Étage 5)
		if (type === 'decimal_conversion') {
			const f = this.generateRandomFraction(config);
			const decimalVal = (f.numerator / f.denominator).toFixed(3).replace(/\.?0+$/, "");
			return {
				question: `Convertis ${f.numerator}/${f.denominator} en nombre décimal`,
				correctAnswer: decimalVal,
				type: 'input'
			};
		}

		// 3. CAS STANDARD (Toutes autres phases)
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
