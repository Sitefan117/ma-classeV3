export type WordMastery = 'nouveau' | 'fragile' | 'a-revoir' | 'acquis';

export type WordProgress = {
  status: WordMastery;
  attempts: number;
  correct: number;
  errors: number;
  hints: number;
  lastSeen?: string;
  nextReview?: string;
};

export type VocabularyProgress = Record<string, WordProgress>;

const intervals: Record<WordMastery, number> = {
  nouveau: 0,
  fragile: 1,
  'a-revoir': 3,
  acquis: 14
};

export function emptyWordProgress(): WordProgress {
  return { status: 'nouveau', attempts: 0, correct: 0, errors: 0, hints: 0 };
}

export function updateWordProgress(
  previous: WordProgress | undefined,
  correct: boolean,
  hints = 0,
  now = new Date()
): WordProgress {
  const current = previous ?? emptyWordProgress();
  const attempts = current.attempts + 1;
  const correctCount = current.correct + (correct ? 1 : 0);
  const errors = current.errors + (correct ? 0 : 1);
  const status: WordMastery = correct
    ? (current.status === 'nouveau' ? 'fragile' : current.status === 'fragile' ? 'a-revoir' : 'acquis')
    : (current.status === 'acquis' ? 'a-revoir' : current.status === 'nouveau' ? 'fragile' : current.status);
  const next = new Date(now);
  next.setDate(next.getDate() + intervals[status]);
  return { status, attempts, correct: correctCount, errors, hints: current.hints + hints, lastSeen: now.toISOString(), nextReview: next.toISOString() };
}

export function reviewableWordIds(progress: VocabularyProgress, now = new Date()): string[] {
  return Object.entries(progress)
    .filter(([, item]) => item.status !== 'acquis' || !item.nextReview || new Date(item.nextReview) <= now)
    .sort(([, a], [, b]) => (a.nextReview ?? '').localeCompare(b.nextReview ?? ''))
    .map(([id]) => id);
}

export function masterySummary(progress: VocabularyProgress) {
  const values = Object.values(progress);
  return {
    total: values.length,
    new: values.filter((item) => item.status === 'nouveau').length,
    fragile: values.filter((item) => item.status === 'fragile').length,
    due: values.filter((item) => item.status === 'a-revoir').length,
    acquired: values.filter((item) => item.status === 'acquis').length
  };
}
