import type { RollResult } from '../utils/dice';

import { cn } from '../lib/utils';

export default function DiceRollResult({ result }: { result: RollResult }) {
  const droppedCount = result.dice.filter((d) => !d.kept).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex items-center justify-center min-w-[3.5rem] bg-primary text-primary-foreground text-2xl font-bold rounded-xl px-4 py-2 self-start">
        {result.total}
      </div>
      <div className="flex flex-wrap gap-2">
        {result.dice.map((die, i) =>
          die.kept ? (
            <span
              key={i}
              className={cn(
                'inline-flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm',
                'bg-[var(--color-grass)] text-[var(--color-grass-foreground)]',
              )}
            >
              {die.value}
            </span>
          ) : (
            <span
              key={i}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm bg-secondary text-muted-foreground line-through"
            >
              {die.value}
            </span>
          ),
        )}
      </div>
      {(result.modifier !== 0 || droppedCount > 0) && (
        <p className="text-xs text-muted-foreground">
          {droppedCount > 0 && `${droppedCount} dropped`}
          {droppedCount > 0 && result.modifier !== 0 && ' · '}
          {result.modifier !== 0 &&
            `modifier ${result.modifier > 0 ? '+' : ''}${result.modifier}`}
        </p>
      )}
    </div>
  );
}
