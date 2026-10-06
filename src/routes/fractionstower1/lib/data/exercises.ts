export interface Exercise {
  id: string;
  competencyId: string;
  title: string;
  instruction: string;
  type: 'visual_rect' | 'number_line' | 'quantity' | 'equivalent';
  data: {
    numerator?: number;
    denominator?: number;
    totalParts?: number;
    totalQuantity?: number;
    options?: string[];
  };
  correctAnswer: string;
  hint: string;
}

export const EXERCISES_DATABASE: Record<string, Exercise> = {
  frac_01: {
    id: 'frac_01',
    competencyId: 'MSN_21_DEMIS',
    title: 'Épreuve 1 : Représentation Visuelle',
    instruction: 'Quelle fraction de la figure est colorée en vert ?',
    type: 'visual_rect',
    data: {
      numerator: 3,
      denominator: 4,
      totalParts: 4
    },
    correctAnswer: '3/4',
    hint: 'Compte le nombre de parts vertes (numérateur) sur le total de parts (dénominateur).'
  },
  frac_02: {
    id: 'frac_02',
    competencyId: 'MSN_21_EQUIV',
    title: 'Épreuve 2 : Fractions Équivalentes',
    instruction: 'Trouve la fraction équivalente : 1/2 est égal à combien de quarts ?',
    type: 'equivalent',
    data: {
      options: ['1/4', '2/4', '3/4', '4/4']
    },
    correctAnswer: '2/4',
    hint: 'Si tu coupes chaque demi en deux, tu obtiens 2 quarts.'
  },
  frac_03: {
    id: 'frac_03',
    competencyId: 'MSN_21_QUANT',
    title: 'Épreuve 3 : Fraction d\'une Quantité',
    instruction: 'Combien font 2/3 de 12 pommes ?',
    type: 'quantity',
    data: {
      numerator: 2,
      denominator: 3,
      totalQuantity: 12,
      options: ['4', '6', '8', '9']
    },
    correctAnswer: '8',
    hint: 'Calcule d\'abord 1/3 de 12 (12 ÷ 3 = 4), puis multiplie par 2.'
  }
};