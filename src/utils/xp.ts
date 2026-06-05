export const MAX_LEVEL = 80;

// Minimum XP required to be at each level (index 0 = level 1).
// Level-up costs follow a Fibonacci sequence starting 1000, 2000, 3000, 5000 …
export const XP_THRESHOLDS: number[] = (() => {
  const costs: number[] = [1000, 2000];
  while (costs.length < MAX_LEVEL - 1) {
    const a = costs[costs.length - 1] as number;
    const b = costs[costs.length - 2] as number;
    costs.push(a + b);
  }
  const thresholds: number[] = [0];
  for (const cost of costs) {
    const last = thresholds[thresholds.length - 1] as number;
    thresholds.push(last + cost);
  }
  return thresholds;
})();

export function xpToLevel(xp: number): number {
  let level = 1;
  for (let i = 1; i < XP_THRESHOLDS.length; i++) {
    const threshold = XP_THRESHOLDS[i];
    if (threshold !== undefined && xp >= threshold) level = i + 1;
    else break;
  }
  return level;
}

export const fmt = (n: number) => n.toLocaleString('en-US');
