// -----------------------------------------------------------------------------
// MOTEUR DE FRACTIONS
// Gère la logique mathématique des fractions : simplification, 
// comparaison, conversion décimale et équivalence.
// -----------------------------------------------------------------------------

export interface Fraction {
    numerator: number;
    denominator: number;
}

export class FractionEngine {
	/**
	 * Calcule le PGCD (Plus Grand Commun Diviseur)
	 */
	static gcd(a: number, b: number): number {
		return b === 0 ? a : this.gcd(b, a % b);
	}

	/**
	 * Simplifie une fraction au maximum.
	 */
	static simplify(fraction: Fraction): Fraction {
		const common = this.gcd(Math.abs(fraction.numerator), Math.abs(fraction.denominator));
		return {
			numerator: fraction.numerator / common,
			denominator: fraction.denominator / common
		};
	}

	/**
	 * Vérifie si deux fractions sont équivalentes.
	 */
	static areEquivalent(f1: Fraction, f2: Fraction): boolean {
		return f1.numerator * f2.denominator === f2.numerator * f1.denominator;
	}

	/**
	 * Convertit une fraction en nombre décimal.
	 */
	static toDecimal(fraction: Fraction): number {
		return fraction.numerator / fraction.denominator;
	}

	/**
	 * Convertit un nombre décimal en fraction (simplifiée).
	 */
	static fromDecimal(decimal: number): Fraction {
		const precision = 1000; // Précision aux millièmes
		let num = Math.round(decimal * precision);
		let den = precision;
		
		const common = this.gcd(num, den);
		return {
			numerator: num / common,
			denominator: den / common
		};
	}

	/**
	 * Compare deux fractions.
	 * Retourne -1 si f1 < f2, 1 si f1 > f2, 0 si égales.
	 */
	static compare(f1: Fraction, f2: Fraction): number {
		const diff = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
		return diff === 0 ? 0 : (diff > 0 ? 1 : -1);
	}
}
