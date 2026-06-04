export const MAX_LEVEL = 80

// Minimum XP required to be at each level (index 0 = level 1).
// Level-up costs follow a Fibonacci sequence starting 1000, 2000, 3000, 5000 …
export const XP_THRESHOLDS: number[] = (() => {
  const costs = [1000, 2000]
  while (costs.length < MAX_LEVEL - 1) {
    costs.push(costs[costs.length - 1] + costs[costs.length - 2])
  }
  const thresholds = [0]
  for (const cost of costs) thresholds.push(thresholds[thresholds.length - 1] + cost)
  return thresholds
})()

export function xpToLevel(xp: number): number {
  let level = 1
  for (let i = 1; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1
    else break
  }
  return level
}

export const fmt = (n: number) => n.toLocaleString('en-US')
