import { describe, it, expect, vi, afterEach } from 'vitest';
import { roll } from '../../src/utils/dice';

describe('roll', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('produces the correct number of dice', () => {
    const result = roll(5, 6, 0);
    expect(result.dice).toHaveLength(5);
  });

  it('returns each die value within the expected range [1, sides]', () => {
    const result = roll(20, 20, 0);
    for (const die of result.dice) {
      expect(die.value).toBeGreaterThanOrEqual(1);
      expect(die.value).toBeLessThanOrEqual(20);
    }
  });

  it('keeps every die when keepCount is undefined', () => {
    const result = roll(4, 6, 0);
    expect(result.dice.every((d) => d.kept)).toBe(true);
  });

  it('keeps every die when keepCount >= count', () => {
    const result = roll(3, 6, 0, 5);
    expect(result.dice.every((d) => d.kept)).toBe(true);
  });

  it('adds a positive modifier to the total', () => {
    // Math.random() = 0 → Math.floor(0 * 6) + 1 = 1 per die
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const result = roll(4, 6, 5);
    // 4 dice × 1 + 5 = 9
    expect(result.total).toBe(9);
    expect(result.modifier).toBe(5);
  });

  it('supports a negative modifier', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const result = roll(3, 6, -2);
    // 3 dice × 1 - 2 = 1
    expect(result.total).toBe(1);
    expect(result.modifier).toBe(-2);
  });

  it('keeps only the highest N dice when keepBest is true', () => {
    // Target values [1, 5, 2, 6] → Math.random = (v - 1) / sides
    const values = [1, 5, 2, 6].map((v) => (v - 1) / 6);
    vi.spyOn(Math, 'random').mockImplementation(() => values.shift() ?? 0);
    const result = roll(4, 6, 0, 2, true);
    // Best 2 are 6 (idx 3) and 5 (idx 1) → total 11
    const [d0, d1, d2, d3] = result.dice;
    expect(result.total).toBe(11);
    expect(d0?.kept).toBe(false);
    expect(d1?.kept).toBe(true);
    expect(d2?.kept).toBe(false);
    expect(d3?.kept).toBe(true);
  });

  it('keeps only the lowest N dice when keepBest is false', () => {
    const values = [4, 1, 6, 2].map((v) => (v - 1) / 6);
    vi.spyOn(Math, 'random').mockImplementation(() => values.shift() ?? 0);
    const result = roll(4, 6, 0, 2, false);
    // Worst 2 are 1 (idx 1) and 2 (idx 3) → total 3
    const [d0, d1, d2, d3] = result.dice;
    expect(result.total).toBe(3);
    expect(d0?.kept).toBe(false);
    expect(d1?.kept).toBe(true);
    expect(d2?.kept).toBe(false);
    expect(d3?.kept).toBe(true);
  });

  it('preserves original die order regardless of which dice are kept', () => {
    const values = [6, 1, 6, 1].map((v) => (v - 1) / 6);
    vi.spyOn(Math, 'random').mockImplementation(() => values.shift() ?? 0);
    const result = roll(4, 6, 0, 2, true);
    expect(result.dice.map((d) => d.value)).toEqual([6, 1, 6, 1]);
  });
});
