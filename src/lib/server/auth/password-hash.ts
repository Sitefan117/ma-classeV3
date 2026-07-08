import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

const PBKDF2_PREFIX = 'pbkdf2_sha256';
const DEFAULT_ITERATIONS = 210_000;
const KEY_LENGTH = 32;

function safeEqualHex(aHex: string, bHex: string): boolean {
  try {
    const a = Buffer.from(aHex, 'hex');
    const b = Buffer.from(bHex, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function hashTeacherPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const digest = pbkdf2Sync(password, salt, DEFAULT_ITERATIONS, KEY_LENGTH, 'sha256').toString('hex');
  return `${PBKDF2_PREFIX}$${DEFAULT_ITERATIONS}$${salt}$${digest}`;
}

export function verifyPasswordHash(password: string, encodedHash: string): boolean {
  if (encodedHash.startsWith(`${PBKDF2_PREFIX}$`)) {
    const [, iterationsText, salt, expected] = encodedHash.split('$');
    const iterations = Number.parseInt(iterationsText ?? '', 10);
    if (!Number.isFinite(iterations) || !salt || !expected) return false;

    const actual = pbkdf2Sync(password, salt, iterations, KEY_LENGTH, 'sha256').toString('hex');
    return safeEqualHex(actual, expected);
  }

  if (encodedHash.startsWith('sha256$')) {
    const expected = encodedHash.slice('sha256$'.length);
    const actual = createHash('sha256').update(password).digest('hex');
    return safeEqualHex(actual, expected);
  }

  if (/^[a-f0-9]{64}$/i.test(encodedHash)) {
    const actual = createHash('sha256').update(password).digest('hex');
    return safeEqualHex(actual, encodedHash);
  }

  return false;
}

export function safeEqualText(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
