import { useState } from 'react';
import type { RacialBonus } from '../../../campaigns/types';
import { labelClass, selectClass } from './styles';

export type AttributeMethod =
  | 'roll5d6k3'
  | 'roll4d6k3'
  | 'roll1d10p8'
  | 'standard'
  | 'pointbuy';

export interface Attributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

const ATTRIBUTE_METHODS: { value: AttributeMethod; label: string }[] = [
  { value: 'roll5d6k3', label: 'Roll 5d6, keep 3' },
  { value: 'roll4d6k3', label: 'Roll 4d6, keep 3' },
  { value: 'roll1d10p8', label: 'Roll 1d10+8' },
  { value: 'standard', label: 'Standard Array' },
  { value: 'pointbuy', label: 'Point buy' },
];

const ATTRIBUTE_LABELS: { key: keyof Attributes; label: string }[] = [
  { key: 'str', label: 'Strength' },
  { key: 'dex', label: 'Dexterity' },
  { key: 'con', label: 'Constitution' },
  { key: 'int', label: 'Intelligence' },
  { key: 'wis', label: 'Wisdom' },
  { key: 'cha', label: 'Charisma' },
];

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const POINT_BUY_TOTAL = 27;

interface RolledScore {
  value: number;
  allDice: number[];
  numKept: number;
  modifier: number;
}

const rowButtonClass =
  'flex items-center justify-center w-4 h-4 rounded bg-ctp-surface1 border border-ctp-surface2 text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-surface2 transition-colors text-xs font-bold cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed';

function modifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

function sumTopN(dice: number[], n: number): number {
  return [...dice]
    .sort((a, b) => b - a)
    .slice(0, n)
    .reduce((s, v) => s + v, 0);
}

function performRoll(method: AttributeMethod): RolledScore {
  if (method === 'roll5d6k3') {
    const dice = Array.from({ length: 5 }, () => rollDie(6));
    return { allDice: dice, numKept: 3, modifier: 0, value: sumTopN(dice, 3) };
  }
  if (method === 'roll4d6k3') {
    const dice = Array.from({ length: 4 }, () => rollDie(6));
    return { allDice: dice, numKept: 3, modifier: 0, value: sumTopN(dice, 3) };
  }
  const die = rollDie(10);
  return { allDice: [die], numKept: 1, modifier: 8, value: die + 8 };
}

function RollTooltip({ score }: { score: RolledScore }) {
  const sortedDice = [...score.allDice].sort((a, b) => b - a);
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ctp-surface1 border border-ctp-surface2 rounded-lg px-2 py-1.5 z-20 pointer-events-none flex gap-1 items-center shadow-lg whitespace-nowrap">
      {sortedDice.map((die, i) =>
        i < score.numKept ? (
          <span
            key={i}
            className="bg-ctp-green text-ctp-base rounded px-1.5 py-0.5 text-xs font-bold"
          >
            {die}
          </span>
        ) : (
          <span
            key={i}
            className="text-ctp-subtext0 line-through text-xs px-0.5"
          >
            {die}
          </span>
        ),
      )}
      {score.modifier > 0 && (
        <span className="text-ctp-subtext1 text-xs ml-0.5">
          +{score.modifier}
        </span>
      )}
    </div>
  );
}

type DragPayload =
  | { source: 'pool'; value: number }
  | { source: 'attr'; attrKey: keyof Attributes };

interface Props {
  method: AttributeMethod;
  onMethodChange: (method: AttributeMethod) => void;
  attributes: Attributes;
  onAttributeChange: (key: keyof Attributes, value: number) => void;
  onAttributeSwap: (key1: keyof Attributes, key2: keyof Attributes) => void;
  racialBonus: RacialBonus;
  kaiLevel: number | '';
  level: number;
  asis: Attributes;
  onAsiChange: (key: keyof Attributes, value: number) => void;
  conditions: Attributes;
  onConditionChange: (key: keyof Attributes, value: number) => void;
}

export default function AttributesSection({
  method,
  onMethodChange,
  attributes,
  onAttributeChange,
  onAttributeSwap,
  racialBonus,
  kaiLevel,
  level,
  asis,
  onAsiChange,
  conditions,
  onConditionChange,
}: Props) {
  const [dragOverKey, setDragOverKey] = useState<keyof Attributes | null>(null);
  const [rolledPool, setRolledPool] = useState<RolledScore[] | null>(null);
  const [hoveredPoolIdx, setHoveredPoolIdx] = useState<number | null>(null);

  const isRollMethod =
    method === 'roll5d6k3' || method === 'roll4d6k3' || method === 'roll1d10p8';
  const attrValues = Object.values(attributes);
  const asiPool = Math.floor(level / 4);
  const asiUsed = Object.values(asis).reduce((s, v) => s + v, 0);
  const asiRemaining = asiPool - asiUsed;
  const availablePoolValues = STANDARD_ARRAY.filter(
    (v) => !attrValues.includes(v),
  );
  const pointBuySpent = attrValues.reduce(
    (sum, v) => sum + Math.max(0, v - 8),
    0,
  );
  const pointBuyRemaining = POINT_BUY_TOTAL - pointBuySpent;

  // Per-index availability for rolled pool (handles duplicate values correctly)
  const availableRolledIndices: boolean[] = rolledPool
    ? (() => {
        const remaining = [...attrValues];
        return rolledPool.map((score) => {
          const idx = remaining.indexOf(score.value);
          if (idx !== -1) {
            remaining.splice(idx, 1);
            return false;
          }
          return true;
        });
      })()
    : [];

  function handleRollAll() {
    const results = Array.from({ length: 6 }, () => performRoll(method));
    results.sort((a, b) => b.value - a.value);
    setRolledPool(results);
  }

  function setDrag(e: React.DragEvent, payload: DragPayload) {
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  }

  function getDrag(e: React.DragEvent): DragPayload | null {
    try {
      return JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      return null;
    }
  }

  function handleAttrDrop(e: React.DragEvent, targetKey: keyof Attributes) {
    e.preventDefault();
    setDragOverKey(null);
    const payload = getDrag(e);
    if (!payload) return;
    if (payload.source === 'pool') {
      onAttributeChange(targetKey, payload.value);
    } else if (payload.source === 'attr' && payload.attrKey !== targetKey) {
      onAttributeSwap(payload.attrKey, targetKey);
    }
  }

  return (
    <section className="bg-ctp-mantle rounded-xl border border-ctp-surface0 p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-ctp-text">Attributes</h3>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 flex flex-col gap-1">
          <label className={labelClass}>Generation Method</label>
          <select
            value={method}
            onChange={(e) => {
              onMethodChange(e.target.value as AttributeMethod);
              setRolledPool(null);
              setHoveredPoolIdx(null);
            }}
            className={selectClass}
          >
            {ATTRIBUTE_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {isRollMethod && (
          <div className="col-span-12 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRollAll}
                className="bg-ctp-mauve hover:bg-ctp-pink text-ctp-base font-semibold rounded-lg px-4 py-2 transition-colors cursor-pointer text-sm"
              >
                🎲 Roll
              </button>
              {rolledPool && (
                <span className={labelClass}>Drag values to attributes</span>
              )}
            </div>
            {rolledPool && (
              <div className="flex gap-2">
                {rolledPool.map((score, idx) => {
                  const available = availableRolledIndices[idx];
                  return (
                    <div
                      key={idx}
                      draggable={available}
                      onDragStart={(e) =>
                        available &&
                        setDrag(e, { source: 'pool', value: score.value })
                      }
                      onMouseEnter={() => setHoveredPoolIdx(idx)}
                      onMouseLeave={() => setHoveredPoolIdx(null)}
                      className={[
                        'relative flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-bold select-none',
                        available
                          ? 'bg-ctp-surface0 border-ctp-surface2 text-ctp-text cursor-grab active:cursor-grabbing'
                          : 'bg-ctp-surface0 border-ctp-surface1 text-ctp-subtext0 opacity-40 cursor-not-allowed',
                      ].join(' ')}
                    >
                      {score.value}
                      {hoveredPoolIdx === idx && <RollTooltip score={score} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {method === 'pointbuy' && (
          <div className="col-span-12 flex items-center gap-3">
            <span className={labelClass}>Points remaining:</span>
            <span
              className={`text-sm font-bold ${pointBuyRemaining === 0 ? 'text-ctp-red' : 'text-ctp-green'}`}
            >
              {pointBuyRemaining} / {POINT_BUY_TOTAL}
            </span>
          </div>
        )}

        {asiPool > 0 && (
          <div className="col-span-12 flex items-center gap-3">
            <span className={labelClass}>ASIs remaining:</span>
            <span
              className={`text-sm font-bold ${asiRemaining === 0 ? 'text-ctp-yellow' : 'text-ctp-green'}`}
            >
              {asiRemaining} / {asiPool}
            </span>
          </div>
        )}

        {method === 'standard' && (
          <div className="col-span-12 flex flex-col gap-2">
            <span className={labelClass}>
              Available values — drag to an attribute
            </span>
            <div className="flex gap-2">
              {STANDARD_ARRAY.map((value) => {
                const available = availablePoolValues.includes(value);
                return (
                  <div
                    key={value}
                    draggable={available}
                    onDragStart={(e) =>
                      available && setDrag(e, { source: 'pool', value })
                    }
                    className={[
                      'flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-bold select-none',
                      available
                        ? 'bg-ctp-surface0 border-ctp-surface2 text-ctp-text cursor-grab active:cursor-grabbing'
                        : 'bg-ctp-surface0 border-ctp-surface1 text-ctp-subtext0 opacity-40 cursor-not-allowed',
                    ].join(' ')}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="col-span-12 grid grid-cols-3 gap-3">
          {ATTRIBUTE_LABELS.map(({ key, label }) => {
            const base = attributes[key];
            const kaiBonus =
              kaiLevel !== '' ? Math.max(0, (kaiLevel as number) - base) : 0;
            const racialBonusForAttr = racialBonus[key] ?? 0;
            const asiForAttr = asis[key];
            const conditionForAttr = conditions[key];
            const finalScore =
              base +
              kaiBonus +
              racialBonusForAttr +
              asiForAttr +
              conditionForAttr;
            const isOver = dragOverKey === key;
            const baseDecDisabled = method !== 'pointbuy' || base <= 8;
            const baseIncDisabled =
              method !== 'pointbuy' || base >= 18 || pointBuyRemaining === 0;
            const asiDecDisabled = asiForAttr <= 0;
            const asiIncDisabled = asiRemaining <= 0;
            return (
              <div
                key={key}
                draggable
                onDragStart={(e) =>
                  setDrag(e, { source: 'attr', attrKey: key })
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverKey(key);
                }}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={(e) => handleAttrDrop(e, key)}
                className={[
                  'flex flex-col items-center bg-ctp-surface0 border rounded-xl p-3 gap-1 cursor-grab active:cursor-grabbing transition-colors',
                  isOver
                    ? 'border-ctp-mauve bg-ctp-surface1'
                    : 'border-ctp-surface1',
                ].join(' ')}
              >
                <h3 className="text-xs font-semibold text-ctp-subtext1 uppercase tracking-wider">
                  {label}
                </h3>
                <div className="text-3xl font-bold text-ctp-text w-10 text-center">
                  {finalScore}
                </div>
                <div className="text-base font-semibold text-ctp-mauve">
                  {modifier(finalScore)}
                </div>
                <div className="w-full border-t border-ctp-surface2 mt-1 pt-2 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs text-ctp-subtext1">
                    <span>Base</span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={baseDecDisabled}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onAttributeChange(key, base - 1)}
                        className={rowButtonClass}
                      >
                        −
                      </button>
                      <span className="w-5 text-center">{base}</span>
                      <button
                        disabled={baseIncDisabled}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onAttributeChange(key, base + 1)}
                        className={rowButtonClass}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-ctp-subtext1">
                    <span>ASIs</span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={asiDecDisabled}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onAsiChange(key, asiForAttr - 1)}
                        className={rowButtonClass}
                      >
                        −
                      </button>
                      <span className="w-5 text-center">+{asiForAttr}</span>
                      <button
                        disabled={asiIncDisabled}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onAsiChange(key, asiForAttr + 1)}
                        className={rowButtonClass}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-ctp-subtext1">
                    <span>Condition</span>
                    <div className="flex items-center gap-1">
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() =>
                          onConditionChange(key, conditionForAttr - 1)
                        }
                        className={rowButtonClass}
                      >
                        −
                      </button>
                      <span className="w-5 text-center">
                        {conditionForAttr > 0
                          ? `+${conditionForAttr}`
                          : conditionForAttr}
                      </span>
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() =>
                          onConditionChange(key, conditionForAttr + 1)
                        }
                        className={rowButtonClass}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-ctp-subtext1">
                    <span>Racial bonus</span>
                    <span>+{racialBonusForAttr}</span>
                  </div>
                  <div className="flex justify-between text-xs text-ctp-subtext1">
                    <span>Kai bonus</span>
                    <span>+{kaiBonus}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
