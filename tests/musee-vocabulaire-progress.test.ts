import assert from 'node:assert/strict';
import { masterySummary, reviewableWordIds, updateWordProgress } from '../src/lib/games/musee-vocabulaire/progress';

const start = new Date('2026-01-01T10:00:00Z');
const first = updateWordProgress(undefined, true, 1, start);
assert.equal(first.status, 'fragile');
assert.equal(first.hints, 1);
const second = updateWordProgress(first, true, 0, new Date('2026-01-02T10:00:00Z'));
assert.equal(second.status, 'a-revoir');
const third = updateWordProgress(second, true, 0, new Date('2026-01-05T10:00:00Z'));
assert.equal(third.status, 'acquis');
assert.deepEqual(reviewableWordIds({ a: third }, new Date('2026-01-19T10:00:00Z')), ['a']);
assert.deepEqual(masterySummary({ a: third, b: first }), { total: 2, new: 0, fragile: 1, due: 0, acquired: 1 });
console.log('Progression du Musée des mots validée.');
