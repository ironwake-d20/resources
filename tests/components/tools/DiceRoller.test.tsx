import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import DiceRoller from '../../../src/components/tools/DiceRoller';

function getTotal(container: HTMLElement): string | null {
  // The total lives in a div, not the button.
  const total = container.querySelector('div.bg-primary');
  return total ? total.textContent : null;
}

describe('DiceRoller', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the heading and roll button', () => {
    render(<DiceRoller />);
    expect(screen.getByText('Dice Roller')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /roll dice/i }),
    ).toBeInTheDocument();
  });

  it('rolls dice and displays a result when the button is clicked', () => {
    // Math.random() = 0 → Math.floor(0 * 6) + 1 = 1 per die
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(<DiceRoller />);

    fireEvent.click(screen.getByRole('button', { name: /roll dice/i }));

    // Default: 4d6 + 0 → 4 dice × 1 = 4
    expect(getTotal(container)).toBe('4');
  });

  it('updates the count and sides inputs and rerolls', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // value 1 per die
    const { container } = render(<DiceRoller />);

    const [countInput, sidesInput] = screen.getAllByRole('spinbutton');
    if (countInput && sidesInput) {
      fireEvent.change(countInput, { target: { value: '3' } });
      fireEvent.change(sidesInput, { target: { value: '10' } });
    }

    fireEvent.click(screen.getByRole('button', { name: /roll dice/i }));
    // 3 dice × 1 = 3
    expect(getTotal(container)).toBe('3');
  });

  it('applies a positive modifier to the total', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(<DiceRoller />);

    const [countInput, , modifierInput] = screen.getAllByRole('spinbutton');
    if (countInput && modifierInput) {
      fireEvent.change(countInput, { target: { value: '3' } });
      fireEvent.change(modifierInput, { target: { value: '7' } });
    }

    fireEvent.click(screen.getByRole('button', { name: /roll dice/i }));
    // 3 dice × 1 + 7 = 10
    expect(getTotal(container)).toBe('10');
  });

  it('keeps only the best N dice when keep-all is unchecked', () => {
    // Target values [1, 5, 2, 6] → Math.random = (v - 1) / sides
    const values = [1, 5, 2, 6].map((v) => (v - 1) / 6);
    vi.spyOn(Math, 'random').mockImplementation(() => values.shift() ?? 0);

    const { container } = render(<DiceRoller />);

    const keepAll = screen.getByLabelText(/keep all/i) as HTMLInputElement;
    fireEvent.click(keepAll);
    expect(keepAll.checked).toBe(false);

    // After unchecking "keep all", the keep input shows up.
    const inputs = screen.getAllByRole('spinbutton');
    // inputs: [count, sides, modifier, keepCount]
    const keepInput = inputs[3];
    if (keepInput) {
      fireEvent.change(keepInput, { target: { value: '2' } });
    }

    fireEvent.click(screen.getByRole('button', { name: /roll dice/i }));
    // Best 2 of [1, 5, 2, 6] = 5 + 6 = 11
    expect(getTotal(container)).toBe('11');
  });
});
