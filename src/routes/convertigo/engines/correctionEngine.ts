export function validateAnswer(userAnswer: number | string, expectedValue: number): boolean {
  const numericAnswer = typeof userAnswer === 'string' ? parseFloat(userAnswer.replace(',', '.')) : userAnswer;
  if (isNaN(numericAnswer)) return false;
  
  // Tolérance pour éviter les soucis de micro-arrondis JavaScript
  return Math.abs(numericAnswer - expectedValue) < 0.0001;
}
