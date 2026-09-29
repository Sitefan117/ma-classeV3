export type ExerciseType =
  | 'conversion'
  | 'choice'
  | 'order'
  | 'number'
  | 'classification';

export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  audioText?: string;
  givenValue?: number;
  givenUnit?: string;
  targetUnit?: string;
  expectedValue?: number;
  options?: string[];
  expected?: string;
  items?: string[];
  expectedOrder?: string[];
  hint: string;
  helpText?: string;
}

export interface BeltContent {
  grade: '7H' | '8H';
  belt: BeltId;
  title: string;
  zone: string;
  icon: string;
  color: string;
  objectives: string[];
  theory: {
    title: string;
    text: string;
    audioText: string;
    animation: 'length' | 'area' | 'volume' | 'mass' | 'time' | 'angle' | 'point';
  };
  flashCheck: {
    question: string;
    audioText: string;
    options: string[];
    expectedIndex: number;
  };
  exercises: Exercise[];
  boss: {
    name: string;
    icon: string;
    intro: string;
  };
}

export type BeltId = 'white' | 'yellow' | 'green' | 'blue' | 'black';
