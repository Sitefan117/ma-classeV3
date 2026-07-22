export interface Exercise {
  id: string;
  domain: string;
  skillId: string;
  difficulty: number;
  instruction: string;
  givenValue: number;
  givenUnit: string;
  targetUnit: string;
  expectedValue: number;
  hint: string;
}
