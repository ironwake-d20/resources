import { useState } from 'react';
import { roll, type RollResult } from '../../utils/dice';
import DiceRollResult from '../DiceRollResult';

import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

const inputClass = 'w-16 text-center tabular-nums';

function clampInt(value: string, min: number, fallback: number): number {
  const n = parseInt(value);
  return isNaN(n) ? fallback : Math.max(min, n);
}

export default function DiceRoller() {
  const [count, setCount] = useState(4);
  const [sides, setSides] = useState(6);
  const [modifier, setModifier] = useState(0);
  const [keepAll, setKeepAll] = useState(true);
  const [keepCount, setKeepCount] = useState(3);
  const [keepBest, setKeepBest] = useState(true);
  const [result, setResult] = useState<RollResult | null>(null);

  function handleRoll() {
    const resolvedKeep = keepAll ? undefined : Math.min(keepCount, count);
    setResult(roll(count, sides, modifier, resolvedKeep, keepBest));
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-1">
        Dice Roller
      </h2>
      <p className="text-muted-foreground mb-8">
        Roll and keep dice for any purpose.
      </p>

      <Card className="p-6 flex flex-col gap-5 max-w-md">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Roll</span>
          <Input
            type="number"
            min={1}
            value={count}
            onChange={(e) => {
              const newCount = clampInt(e.target.value, 1, 1);
              setCount(newCount);
              if (keepCount > newCount) setKeepCount(newCount);
            }}
            className={inputClass}
          />
          <span className="text-sm text-muted-foreground">d</span>
          <Input
            type="number"
            min={2}
            value={sides}
            onChange={(e) => setSides(clampInt(e.target.value, 2, 2))}
            className={inputClass}
          />
          <span className="text-sm text-muted-foreground">+</span>
          <Input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepAll}
              onChange={(e) => setKeepAll(e.target.checked)}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <span className="text-sm text-foreground">Keep all</span>
          </label>

          {!keepAll && (
            <div className="flex items-center gap-2 pl-6">
              <span className="text-sm text-muted-foreground">Keep</span>
              <Input
                type="number"
                min={1}
                max={count}
                value={keepCount}
                onChange={(e) =>
                  setKeepCount(Math.min(count, clampInt(e.target.value, 1, 1)))
                }
                className={inputClass}
              />
              <select
                value={keepBest ? 'best' : 'worst'}
                onChange={(e) => setKeepBest(e.target.value === 'best')}
                className="bg-secondary border border-input text-foreground rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
              >
                <option value="best">best</option>
                <option value="worst">worst</option>
              </select>
            </div>
          )}
        </div>

        <Button onClick={handleRoll} className="self-start">
          🎲 Roll Dice
        </Button>
      </Card>

      {result && (
        <div className="mt-6">
          <DiceRollResult result={result} />
        </div>
      )}
    </div>
  );
}
