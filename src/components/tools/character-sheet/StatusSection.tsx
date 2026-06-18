export type StabilisationState = 'empty' | 'success' | 'failed';

import { ChangeableRow, ConstantRow } from './ScoreComponentRow';

interface Props {
  level: number;
  vitalityMax: number;
  currentVitality: number;
  onCurrentVitalityChange: (value: number) => void;
  vitalityConModifier: number;
  vitalityRacialBonus: number;
  vitalityClassBonus: number;
  vitalityKaiBonus: number;
  vitalityRolls: number[];
  onVitalityRerollAll: () => void;
  vitalityCondition: number;
  onVitalityConditionChange: (value: number) => void;
  woundsBase: number;
  woundsKaiBonus: number;
  woundsClassBonus: number;
  woundsCondition: number;
  currentWounds: number;
  onCurrentWoundsChange: (value: number) => void;
  onWoundsConditionChange: (value: number) => void;
  manaMax: number;
  currentMana: number;
  onCurrentManaChange: (value: number) => void;
  manaEnabled: boolean;
  manaAttrModifier: number;
  manaKaiBonus: number;
  manaCondition: number;
  onManaConditionChange: (value: number) => void;
  overdrawEvents: number;
  onOverdrawEventsChange: (value: number) => void;
  stabilisationChecks: StabilisationState[];
  onStabilisationCheckChange: (
    index: number,
    value: StabilisationState,
  ) => void;
  onStabilisationChecksReset: () => void;
}

const rowButtonClass =
  'flex items-center justify-center w-7 h-7 rounded bg-secondary border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm font-bold cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed';

function ManaCard({
  max,
  current,
  onChange,
  enabled,
  attrModifier,
  kaiBonus,
  condition,
  onConditionChange,
  level,
}: {
  max: number;
  current: number;
  onChange: (value: number) => void;
  enabled: boolean;
  attrModifier: number;
  kaiBonus: number;
  condition: number;
  onConditionChange: (value: number) => void;
  level: number;
}) {
  if (!enabled) {
    return (
      <div className="flex flex-col items-center bg-secondary border rounded-xl p-4 gap-2 opacity-50">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Mana
        </h4>
        <div className="text-3xl font-bold text-muted-foreground tabular-nums">
          —
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center bg-secondary border rounded-xl p-4 gap-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Mana
      </h4>
      <div className="text-3xl font-bold text-foreground tabular-nums">
        {current}
        <span className="text-muted-foreground text-xl font-medium">
          /{max}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={current <= 0}
          onClick={() => onChange(current - 1)}
          className={rowButtonClass}
        >
          -
        </button>
        <button
          disabled={current >= max}
          onClick={() => onChange(current + 1)}
          className={rowButtonClass}
        >
          +
        </button>
      </div>
      <div className="w-full border-t border-border mt-1 pt-2 flex flex-col gap-1 text-xs text-muted-foreground">
        <ConstantRow label="Base" value={10 * level} signed={false} />
        <ChangeableRow
          label="Condition"
          value={condition}
          onChange={onConditionChange}
        />
        <ConstantRow label="Attr mod" value={attrModifier * level} />
        <ConstantRow label="Kai bonus" value={kaiBonus} />
      </div>
    </div>
  );
}

function VitalityCard({
  max,
  current,
  onChange,
  condition,
  onConditionChange,
  conModifier,
  racialBonus,
  classBonus,
  kaiBonus,
  rolls,
  level,
}: {
  max: number;
  current: number;
  onChange: (value: number) => void;
  condition: number;
  onConditionChange: (value: number) => void;
  conModifier: number;
  racialBonus: number;
  classBonus: number;
  kaiBonus: number;
  rolls: number[];
  level: number;
}) {
  const rollsTotal = rolls.reduce((a, b) => a + b, 0);
  return (
    <div className="flex flex-col items-center bg-secondary border rounded-xl p-4 gap-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Vitality
      </h4>
      <div className="text-3xl font-bold text-foreground tabular-nums">
        {current}
        <span className="text-muted-foreground text-xl font-medium">
          /{max}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={current <= 0}
          onClick={() => onChange(current - 1)}
          className={rowButtonClass}
        >
          -
        </button>
        <button
          disabled={current >= max}
          onClick={() => onChange(current + 1)}
          className={rowButtonClass}
        >
          +
        </button>
      </div>
      <div className="w-full border-t border-border mt-1 pt-2 flex flex-col gap-1 text-xs text-muted-foreground">
        <ConstantRow label="Base" value={1} signed={false} />
        <ChangeableRow
          label="Condition"
          value={condition}
          onChange={onConditionChange}
        />
        <ConstantRow
          label="Level HD"
          value={rollsTotal}
          tooltip={
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground">
                {level}d4 rolls
              </span>
              <div className="flex gap-1">
                {rolls.map((r, i) => (
                  <span
                    key={i}
                    className="bg-card rounded px-1.5 py-0.5 text-xs font-bold text-foreground"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          }
        />
        <ConstantRow label="CON mod" value={conModifier * level} />
        <ConstantRow label="Racial bonus" value={racialBonus * level} />
        <ConstantRow label="Class bonus" value={classBonus * level} />
        <ConstantRow label="Kai bonus" value={kaiBonus * level} />
      </div>
    </div>
  );
}

function WoundsCard({
  base,
  kaiBonus,
  classBonus,
  condition,
  current,
  onChange,
  onConditionChange,
}: {
  base: number;
  kaiBonus: number;
  classBonus: number;
  condition: number;
  current: number;
  onChange: (value: number) => void;
  onConditionChange: (value: number) => void;
}) {
  const max = Math.max(1, base + kaiBonus + classBonus + condition);
  return (
    <div className="flex flex-col items-center bg-secondary border rounded-xl p-4 gap-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Wounds
      </h4>
      <div className="text-3xl font-bold text-foreground tabular-nums">
        {current}
        <span className="text-muted-foreground text-xl font-medium">
          /{max}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={current <= 0}
          onClick={() => onChange(current - 1)}
          className={rowButtonClass}
        >
          -
        </button>
        <button
          disabled={current >= max}
          onClick={() => onChange(current + 1)}
          className={rowButtonClass}
        >
          +
        </button>
      </div>
      <div className="w-full border-t border-border mt-1 pt-2 flex flex-col gap-1 text-xs text-muted-foreground">
        <ConstantRow label="Base" value={base} signed={false} />
        <ChangeableRow
          label="Condition"
          value={condition}
          onChange={onConditionChange}
        />
        <ConstantRow label="Kai bonus" value={kaiBonus} />
        <ConstantRow label="Class bonus" value={classBonus} />
      </div>
    </div>
  );
}

function StabilisationCircles({
  checks,
  onChange,
  onReset,
}: {
  checks: StabilisationState[];
  onChange: (index: number, value: StabilisationState) => void;
  onReset: () => void;
}) {
  function toggleCircle(index: number, e: React.MouseEvent) {
    e.preventDefault();
    const current = checks[index];
    const nextState: StabilisationState =
      current === 'empty'
        ? 'success'
        : current === 'success'
          ? 'failed'
          : 'empty';

    // Going from empty -> something: previous must be toggled (or index 0)
    if (current === 'empty' && index > 0 && checks[index - 1] === 'empty')
      return;
    // Going from something -> empty: no subsequent circle must be toggled
    if (nextState === 'empty') {
      const hasNextToggled = checks.slice(index + 1).some((c) => c !== 'empty');
      if (hasNextToggled) return;
    }
    onChange(index, nextState);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        {checks.map((state, index) => {
          const previousEmpty = index > 0 && checks[index - 1] === 'empty';
          const hasNextToggled = checks
            .slice(index + 1)
            .some((c) => c !== 'empty');
          const canToggle =
            (state === 'empty' && !previousEmpty) ||
            (state !== 'empty' && !hasNextToggled);
          const disabled = !canToggle;
          const isToggled = state !== 'empty';

          let bg = 'bg-secondary border-border';
          let content: React.ReactNode = '';
          if (state === 'success') {
            bg = 'bg-[--success] border-[--success]';
            content = (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-3.5 h-3.5 text-[--success-foreground]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            );
          } else if (state === 'failed') {
            bg = 'bg-destructive border-destructive';
            content = (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-3.5 h-3.5 text-destructive-foreground"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            );
          }

          return (
            <button
              key={index}
              disabled={disabled}
              onClick={(e) => toggleCircle(index, e)}
              title={
                state === 'success'
                  ? 'Success — click to cycle'
                  : state === 'failed'
                    ? 'Failed — click to cycle'
                    : 'Click to toggle'
              }
              className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors select-none ${bg} ${
                disabled
                  ? 'cursor-not-allowed opacity-40'
                  : 'cursor-pointer hover:scale-110 hover:shadow-md'
              } ${isToggled ? 'shadow-sm' : ''}`}
            >
              {content}
            </button>
          );
        })}
      </div>
      <button
        onClick={onReset}
        disabled={checks.every((c) => c === 'empty')}
        className="ml-2 px-2 py-1 text-xs font-semibold rounded bg-secondary border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Reset
      </button>
    </div>
  );
}

export default function StatusSection({
  level,
  vitalityMax,
  currentVitality,
  onCurrentVitalityChange,
  vitalityConModifier,
  vitalityRacialBonus,
  vitalityClassBonus,
  vitalityKaiBonus,
  vitalityRolls,
  onVitalityRerollAll,
  vitalityCondition,
  onVitalityConditionChange,
  woundsBase,
  woundsKaiBonus,
  woundsClassBonus,
  woundsCondition,
  currentWounds,
  onCurrentWoundsChange,
  onWoundsConditionChange,
  manaMax,
  currentMana,
  onCurrentManaChange,
  manaEnabled,
  manaAttrModifier,
  manaKaiBonus,
  manaCondition,
  onManaConditionChange,
  overdrawEvents,
  onOverdrawEventsChange,
  stabilisationChecks,
  onStabilisationCheckChange,
  onStabilisationChecksReset,
}: Props) {
  return (
    <section className="bg-card rounded-xl border p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Status</h3>
        <button
          onClick={onVitalityRerollAll}
          className="text-xs font-semibold rounded-lg bg-secondary border px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
        >
          🎲 Roll Vitality
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <VitalityCard
          max={vitalityMax}
          current={currentVitality}
          onChange={onCurrentVitalityChange}
          condition={vitalityCondition}
          onConditionChange={onVitalityConditionChange}
          conModifier={vitalityConModifier}
          racialBonus={vitalityRacialBonus}
          classBonus={vitalityClassBonus}
          kaiBonus={vitalityKaiBonus}
          rolls={vitalityRolls}
          level={level}
        />
        <WoundsCard
          base={woundsBase}
          kaiBonus={woundsKaiBonus}
          classBonus={woundsClassBonus}
          condition={woundsCondition}
          current={currentWounds}
          onChange={onCurrentWoundsChange}
          onConditionChange={onWoundsConditionChange}
        />
        <ManaCard
          max={manaMax}
          current={currentMana}
          onChange={onCurrentManaChange}
          enabled={manaEnabled}
          attrModifier={manaAttrModifier}
          kaiBonus={manaKaiBonus}
          condition={manaCondition}
          onConditionChange={onManaConditionChange}
          level={level}
        />
      </div>

      <div className="flex items-center justify-between bg-secondary border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Overdraw events
        </h4>
        <div className="flex items-center gap-2">
          <button
            disabled={overdrawEvents <= 0}
            onClick={() => onOverdrawEventsChange(overdrawEvents - 1)}
            className={rowButtonClass}
          >
            -
          </button>
          <span className="text-2xl font-bold text-foreground w-10 text-center tabular-nums">
            {overdrawEvents}
          </span>
          <button
            onClick={() => onOverdrawEventsChange(overdrawEvents + 1)}
            className={rowButtonClass}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between bg-secondary border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Stabilisation checks
        </h4>
        <StabilisationCircles
          checks={stabilisationChecks}
          onChange={onStabilisationCheckChange}
          onReset={onStabilisationChecksReset}
        />
      </div>
    </section>
  );
}
