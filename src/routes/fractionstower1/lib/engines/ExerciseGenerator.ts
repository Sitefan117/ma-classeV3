// -----------------------------------------------------------------------------
// RÔLE DU FICHIER : ExerciseGenerator.ts
// Générateur dynamique d'exercices CUA pour la Tour des Fractions.
// -----------------------------------------------------------------------------

import { FractionEngine } from './FractionEngine';

export interface DynamicExercise {
  id: string;
  competencyId: string;
  title: string;
  instruction: string;
  type: 'visual_rect' | 'quantity' | 'equivalent' | 'boss_battle';
  data: {
    numerator: number;
    denominator: number;
    totalParts?: number;
    totalQuantity?: number;
    options?: string[];
  };
  correctAnswer: string;
  hints: string[];
}

export class ExerciseGenerator {
  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static generate(competencyId: string): DynamicExercise {
    const timeId = Date.now().toString();

    switch (competencyId) {
      case 'frac_01': {
        const den = this.randomInt(2, 6);
        const num = this.randomInt(1, den - 1);
        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: 'Épreuve 1 : Parts d\'un tout',
          instruction: 'Quelle fraction de la figure est colorée en vert ?',
          type: 'visual_rect',
          data: { numerator: num, denominator: den, totalParts: den },
          correctAnswer: `${num}/${den}`,
          hints: [`L'unité est partagée en ${den} parts égales.`]
        };
      }

      case 'frac_02': {
        const baseDen = this.randomInt(2, 4);
        const baseNum = 1;
        const factor = this.randomInt(2, 3);
        const targetNum = baseNum * factor;
        const targetDen = baseDen * factor;
        const options = [
          `${targetNum}/${targetDen}`,
          `${targetNum + 1}/${targetDen}`,
          `${targetNum}/${targetDen + 1}`,
          `1/${targetDen}`
        ].sort(() => Math.random() - 0.5);

        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: 'Épreuve 2 : Fractions équivalentes',
          instruction: `Quelle fraction est équivalente à ${baseNum}/${baseDen} ?`,
          type: 'equivalent',
          data: { numerator: targetNum, denominator: targetDen, options },
          correctAnswer: `${targetNum}/${targetDen}`,
          hints: [`Multiplie le haut et le bas par ${factor}.`]
        };
      }

      case 'frac_03': {
        const den = this.randomInt(2, 5);
        const num = this.randomInt(1, den - 1);
        const mult = this.randomInt(2, 5);
        const total = den * mult;
        const ans = num * mult;
        const options = [
          `${ans}`,
          `${ans + mult}`,
          `${Math.max(1, ans - 2)}`,
          `${total - ans}`
        ].sort(() => Math.random() - 0.5);

        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: 'Épreuve 3 : Fraction d\'une quantité',
          instruction: `Combien font ${num}/${den} de ${total} objets ?`,
          type: 'quantity',
          data: { numerator: num, denominator: den, totalQuantity: total, options },
          correctAnswer: `${ans}`,
          hints: [`Divise ${total} par ${den}, puis multiplie par ${num}.`]
        };
      }

      default:
        return this.generate('frac_01');
    }
  }
}