export function xpForAnswer(usedHelp: boolean) {
  return usedHelp ? 10 : 20;
}

export function levelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export function progressPercent(xp: number) {
  return xp % 100;
}
