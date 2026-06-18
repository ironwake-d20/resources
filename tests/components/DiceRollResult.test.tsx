import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DiceRollResult from '../../src/components/DiceRollResult';
import type { RollResult } from '../../src/utils/dice';

// The total lives in the mauve element; individual dice live in green/gray spans.
// We query the total via its distinct container class to avoid matching a die value.
function getTotal(container: HTMLElement): string | null {
  const total = container.querySelector('div.bg-primary');
  return total ? total.textContent : null;
}

const baseResult: RollResult = {
  dice: [{ value: 3, kept: true }],
  modifier: 0,
  total: 3,
};

describe('DiceRollResult', () => {
  it('renders the total', () => {
    const { container } = render(<DiceRollResult result={baseResult} />);
    expect(getTotal(container)).toBe('3');
  });

  it('does not show a modifier or dropped note when both are absent', () => {
    render(<DiceRollResult result={baseResult} />);
    expect(screen.queryByText(/modifier/)).not.toBeInTheDocument();
    expect(screen.queryByText(/dropped/)).not.toBeInTheDocument();
  });

  it('shows a positive modifier', () => {
    const { container } = render(
      <DiceRollResult
        result={{
          dice: [{ value: 3, kept: true }],
          modifier: 2,
          total: 5,
        }}
      />,
    );
    expect(getTotal(container)).toBe('5');
    expect(screen.getByText(/modifier \+2/)).toBeInTheDocument();
  });

  it('shows a negative modifier', () => {
    const { container } = render(
      <DiceRollResult
        result={{
          dice: [{ value: 3, kept: true }],
          modifier: -2,
          total: 1,
        }}
      />,
    );
    expect(getTotal(container)).toBe('1');
    expect(screen.getByText(/modifier -2/)).toBeInTheDocument();
  });

  it('shows a dropped count when dice are dropped', () => {
    const { container } = render(
      <DiceRollResult
        result={{
          dice: [
            { value: 6, kept: true },
            { value: 1, kept: false },
            { value: 5, kept: true },
            { value: 2, kept: false },
          ],
          modifier: 0,
          total: 11,
        }}
      />,
    );
    expect(getTotal(container)).toBe('11');
    expect(screen.getByText('2 dropped')).toBeInTheDocument();
  });

  it('shows both dropped and modifier when both are present', () => {
    render(
      <DiceRollResult
        result={{
          dice: [
            { value: 6, kept: true },
            { value: 1, kept: false },
          ],
          modifier: 3,
          total: 9,
        }}
      />,
    );
    const meta = screen.getByText(/1 dropped/);
    expect(meta).toHaveTextContent(/1 dropped · modifier \+3/);
  });
});
