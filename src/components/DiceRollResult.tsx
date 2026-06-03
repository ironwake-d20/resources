import type { RollResult } from '../utils/dice'

export default function DiceRollResult({ result }: { result: RollResult }) {
  const droppedCount = result.dice.filter((d) => !d.kept).length

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex items-center justify-center min-w-[3.5rem] bg-ctp-mauve text-ctp-base text-2xl font-bold rounded-xl px-4 py-2 self-start">
        {result.total}
      </div>
      <div className="flex flex-wrap gap-2">
        {result.dice.map((die, i) =>
          die.kept ? (
            <span
              key={i}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm bg-ctp-green text-ctp-base"
            >
              {die.value}
            </span>
          ) : (
            <span
              key={i}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm bg-ctp-surface1 text-ctp-subtext0 line-through"
            >
              {die.value}
            </span>
          )
        )}
      </div>
      {(result.modifier !== 0 || droppedCount > 0) && (
        <p className="text-xs text-ctp-subtext0">
          {droppedCount > 0 && `${droppedCount} dropped`}
          {droppedCount > 0 && result.modifier !== 0 && ' · '}
          {result.modifier !== 0 && `modifier ${result.modifier > 0 ? '+' : ''}${result.modifier}`}
        </p>
      )}
    </div>
  )
}
