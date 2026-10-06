// -----------------------------------------------------------------------------
// RÔLE DU FICHIER : ExerciseEngine.ts
// Moteur de génération dynamique des exercices CUA pour les 8 étages (PER 7H-8H).
// -----------------------------------------------------------------------------

export interface DynamicExercise {
  id: string;
  competencyId: string;
  title: string;
  instruction: string;
  type: 'visual_rect' | 'quantity' | 'equivalent' | 'boss_battle' | 'decimal_convert';
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

export class ExerciseEngine {
  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static generateForZone(competencyId: string): DynamicExercise {
    const timeId = Date.now().toString();

    switch (competencyId) {
      case 'frac_01': { // Étage 1 : Représentation visuelle
        const den = this.getRandomInt(2, 6);
        const num = this.getRandomInt(1, den - 1);
        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: 'Épreuve 1 : Représentation Visuelle',
          instruction: 'Quelle fraction de la figure est colorée en vert ?',
          type: 'visual_rect',
          data: { numerator: num, denominator: den, totalParts: den },
          correctAnswer: `${num}/${den}`,
          hints: [`L'unité est divisée en ${den} parts.`, `${num} parts sur ${den} sont colorées.`]
        };
      }

      case 'frac_02': { // Étage 2 : Fractions équivalentes
        const baseDen = this.getRandomInt(2, 4);
        const baseNum = 1;
        const factor = this.getRandomInt(2, 3);
        const targetNum = baseNum * factor;
        const targetDen = baseDen * factor;
        const options = [`${targetNum}/${targetDen}`, `${targetNum + 1}/${targetDen}`, `${targetNum}/${targetDen + 1}`, `1/${targetDen}`].sort(() => Math.random() - 0.5);

        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: 'Épreuve 2 : Fractions Équivalentes',
          instruction: `Quelle fraction est équivalente à ${baseNum}/${baseDen} ?`,
          type: 'equivalent',
          data: { numerator: targetNum, denominator: targetDen, options },
          correctAnswer: `${targetNum}/${targetDen}`,
          hints: [`Multiplie le haut et le bas par ${factor}.`]
        };
      }

      case 'frac_03': { // Étage 3 : Quantités
        const den = this.getRandomInt(2, 5);
        const num = this.getRandomInt(1, den - 1);
        const mult = this.getRandomInt(2, 5);
        const total = den * mult;
        const ans = num * mult;
        const options = [`${ans}`, `${ans + mult}`, `${Math.max(1, ans - 2)}`, `${total - ans}`].sort(() => Math.random() - 0.5);

        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: 'Épreuve 3 : Fraction d\'une Quantité',
          instruction: `Combien font ${num}/${den} de ${total} objets ?`,
          type: 'quantity',
          data: { numerator: num, denominator: den, totalQuantity: total, options },
          correctAnswer: `${ans}`,
          hints: [`Divise ${total} par ${den} (= ${mult}), puis multiplie par ${num}.`]
        };
      }

      case 'frac_04': { // Étage 4 : Simplification
        const factor = this.getRandomInt(2, 4);
        const simpleNum = this.getRandomInt(1, 3);
        const simpleDen = simpleNum + this.getRandomInt(1, 3);
        const rawNum = simpleNum * factor;
        const rawDen = simpleDen * factor;

        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: 'Épreuve 4 : Simplification',
          instruction: `Simplifie au maximum la fraction ${rawNum}/${rawDen} :`,
          type: 'visual_rect',
          data: { numerator: simpleNum, denominator: simpleDen, totalParts: simpleDen },
          correctAnswer: `${simpleNum}/${simpleDen}`,
          hints: [`Divise le haut et le bas par ${factor}.`]
        };
      }

      case 'frac_05': { // Étage 5 : Boss de Synthèse 1-5
        const den = this.getRandomInt(3, 8);
        const num = this.getRandomInt(1, den - 1);
        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: '⚔ Boss de Synthèse (Étages 1-5)',
          instruction: `Identifie la fraction : ${num} parts vertes sur un total de ${den}.`,
          type: 'boss_battle',
          data: { numerator: num, denominator: den, totalParts: den },
          correctAnswer: `${num}/${den}`,
          hints: [`Forme la fraction : ${num}/${den}.`]
        };
      }

      case 'frac_06': { // Étage 6 : Fractions décimales (dixièmes / centièmes)
        const isHundred = Math.random() > 0.5;
        const den = isHundred ? 100 : 10;
        const num = this.getRandomInt(1, den - 1);

        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: 'Épreuve 6 : Fractions Décimales',
          instruction: `Écris en fraction décimale : ${num} ${den === 10 ? 'dixièmes' : 'centièmes'}`,
          type: 'visual_rect',
          data: { numerator: num, denominator: den, totalParts: 10 },
          correctAnswer: `${num}/${den}`,
          hints: [`Le dénominateur est ${den}.`]
        };
      }

      case 'frac_07': { // Étage 7 : Conversion Décimale
        const num = this.getRandomInt(1, 99);
        const den = 100;
        const decimalVal = (num / den).toFixed(2);
        const options = [`${decimalVal}`, `${(num / 10).toFixed(1)}`, `${(num / 1000).toFixed(3)}`, `${num}`].sort(() => Math.random() - 0.5);

        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: 'Épreuve 7 : Conversion Fraction/Décimal',
          instruction: `Quelle est l'écriture décimale de la fraction ${num}/100 ?`,
          type: 'equivalent',
          data: { numerator: num, denominator: den, options },
          correctAnswer: `${decimalVal}`,
          hints: [`${num}/100 correspond à ${num} centièmes, soit 0,${num < 10 ? '0' + num : num}.`]
        };
      }

      case 'frac_08': { // Étage 8 : Boss Final des 8 Étages
        const den = 100;
        const num = this.getRandomInt(10, 90);
        return {
          id: `dyn_${timeId}`,
          competencyId,
          title: '👑 BOSS FINAL : Maître Suprême des Fractions',
          instruction: `Convertis ${num}/100 en écriture décimale pour terrasser le Boss !`,
          type: 'boss_battle',
          data: { numerator: num, denominator: den, totalParts: 10 },
          correctAnswer: (num / 100).toFixed(2),
          hints: [`Écris sous forme 0.xx`]
        };
      }

      default:
        return this.generateForZone('frac_01');
    }
  }
}