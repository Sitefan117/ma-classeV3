// -----------------------------------------------------------------------------
// RÔLE DU FICHIER : FractionEngine.ts
// Moteur de calcul et de manipulation mathématique des fractions (PGCD, simplification,
// fractions équivalentes, calculs de quantités).
// -----------------------------------------------------------------------------

export interface Fraction {
  numerator: number;
  denominator: number;
}

export class FractionEngine {
  // Calcul du Plus Grand Commun Diviseur (PGCD)
  public static gcd(a: number, b: number): number {
    return b === 0 ? Math.abs(a) : this.gcd(b, a % b);
  }

  // Simplifie une fraction au maximum
  public static simplify(f: Fraction): Fraction {
    const common = this.gcd(f.numerator, f.denominator);
    return {
      numerator: f.numerator / common,
      denominator: f.denominator / common
    };
  }

  // Vérifie l'équivalence exacte de deux fractions
  public static areEquivalent(f1: Fraction, f2: Fraction): boolean {
    return f1.numerator * f2.denominator === f1.denominator * f2.numerator;
  }

  // Calcule la valeur d'une fraction d'une quantité totale (ex: 2/3 de 12 = 8)
  public static calculateQuantity(f: Fraction, total: number): number {
    return (total / f.denominator) * f.numerator;
  }
}