import type { Exercise } from '../types/exercise';

function numberValue(value: string | number): number {
  if (typeof value === 'number') return value;
  return Number(value.replace(',', '.').replace(/\s/g, ''));
}

export function validateExercise(exercise: Exercise, answer: string, order: string[] = []) {
  switch (exercise.type) {
    case 'conversion':
    case 'number':
      if (exercise.expectedValue === undefined) return false;
      return Math.abs(numberValue(answer) - exercise.expectedValue) < 0.0001;

    case 'choice':
    case 'classification':
      return answer.trim() === (exercise.expected ?? '');

    case 'order':
      return JSON.stringify(order) === JSON.stringify(exercise.expectedOrder ?? []);

    default:
      return false;
  }
}
