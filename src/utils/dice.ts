export interface DieResult {
  value: number;
  kept: boolean;
}

export interface RollResult {
  dice: DieResult[];
  modifier: number;
  total: number;
}

export function roll(
  count: number,
  sides: number,
  modifier: number,
  keepCount?: number,
  keepBest: boolean = true,
): RollResult {
  const values = Array.from(
    { length: count },
    () => Math.floor(Math.random() * sides) + 1,
  );

  let dice: DieResult[];
  if (keepCount === undefined || keepCount >= count) {
    dice = values.map((value) => ({ value, kept: true }));
  } else {
    const indexed = values.map((value, index) => ({ value, index }));
    const sorted = [...indexed].sort((a, b) =>
      keepBest ? b.value - a.value : a.value - b.value,
    );
    const keptIndices = new Set(sorted.slice(0, keepCount).map((d) => d.index));
    dice = values.map((value, index) => ({
      value,
      kept: keptIndices.has(index),
    }));
  }

  const keptSum = dice
    .filter((d) => d.kept)
    .reduce((acc, d) => acc + d.value, 0);
  return { dice, modifier, total: keptSum + modifier };
}
