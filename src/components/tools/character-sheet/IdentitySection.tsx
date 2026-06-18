import { campaigns } from 'virtual:campaigns';
import type { Campaign, KaiLevel } from '../../../campaigns/types';
import { XP_THRESHOLDS, fmt, xpToLevel } from '../../../utils/xp';
import KaiLevelSelect from './KaiLevelSelect';
import { inputClass, labelClass, selectClass } from './styles';

const SIZES = ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function kaiBand(position: number): string {
  if (position <= 300) return 'Low';
  if (position <= 700) return 'Medium';
  return 'High';
}

interface Props {
  campaign: Campaign;
  characterName: string;
  onCharacterNameChange: (v: string) => void;
  playerName: string;
  onPlayerNameChange: (v: string) => void;
  age: string;
  onAgeChange: (v: string) => void;
  size: string;
  onSizeChange: (v: string) => void;
  height: string;
  onHeightChange: (v: string) => void;
  weight: string;
  onWeightChange: (v: string) => void;
  religion: string;
  onReligionChange: (v: string) => void;
  lineage: string;
  onLineageChange: (v: string) => void;
  characterClass: string;
  onCharacterClassChange: (v: string) => void;
  subclass: string;
  onSubclassChange: (v: string) => void;
  race: string;
  onRaceChange: (v: string) => void;
  undead: string;
  onUndeadChange: (v: string) => void;
  kaiName: string;
  kaiLevels: KaiLevel[];
  kaiLevel: number | '';
  onKaiLevelChange: (raw: string) => void;
  kaiValue: string;
  onKaiValueChange: (v: string) => void;
  kaiPosition: number;
  onKaiRoll: () => void;
  effectiveMaxLevel: number;
  level: number;
  onLevelChange: (raw: string) => void;
  xp: number;
  onXpChange: (raw: string) => void;
}

export default function IdentitySection({
  campaign,
  characterName,
  onCharacterNameChange,
  playerName,
  onPlayerNameChange,
  age,
  onAgeChange,
  size,
  onSizeChange,
  height,
  onHeightChange,
  weight,
  onWeightChange,
  religion,
  onReligionChange,
  lineage,
  onLineageChange,
  characterClass,
  onCharacterClassChange,
  subclass,
  onSubclassChange,
  race,
  onRaceChange,
  undead,
  onUndeadChange,
  kaiName,
  kaiLevels,
  kaiLevel,
  onKaiLevelChange,
  kaiValue,
  onKaiValueChange,
  kaiPosition,
  onKaiRoll,
  effectiveMaxLevel,
  level,
  onLevelChange,
  xp,
  onXpChange,
}: Props) {
  return (
    <section className="bg-card rounded-xl border p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-foreground">Identity</h3>
      <div className="grid grid-cols-12 gap-4">
        {/* Row 1: names */}
        <div className="col-span-8 flex flex-col gap-1">
          <label className={labelClass}>Character Name</label>
          <input
            type="text"
            placeholder="Enter character name"
            value={characterName}
            onChange={(e) => onCharacterNameChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="col-span-4 flex flex-col gap-1">
          <label className={labelClass}>Player Name</label>
          <input
            type="text"
            placeholder="Enter player name"
            value={playerName}
            onChange={(e) => onPlayerNameChange(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Row 2: physical & religion */}
        <div className="col-span-3 flex flex-col gap-1">
          <label className={labelClass}>Age</label>
          <input
            type="number"
            min={0}
            placeholder="Age"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className={labelClass}>Size</label>
          <select
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
            className={selectClass}
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className={labelClass}>Height (cm)</label>
          <input
            type="number"
            min={0}
            placeholder="cm"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className={labelClass}>Weight (kg)</label>
          <input
            type="number"
            min={0}
            placeholder="kg"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="col-span-3 flex flex-col gap-1">
          <label className={labelClass}>Religion</label>
          <input
            type="text"
            placeholder="Enter religion"
            value={religion}
            onChange={(e) => onReligionChange(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Row 3: lineage / class / subclass */}
        <div className="col-span-4 flex flex-col gap-1">
          <label className={labelClass}>Lineage</label>
          <select
            value={lineage}
            onChange={(e) => onLineageChange(e.target.value)}
            className={selectClass}
          >
            {lineage === '' && (
              <option value="" disabled>
                Select a lineage
              </option>
            )}
            {(campaigns[campaign]?.lineages ?? []).map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-4 flex flex-col gap-1">
          <label className={labelClass}>Class</label>
          <select
            value={characterClass}
            onChange={(e) => onCharacterClassChange(e.target.value)}
            className={selectClass}
          >
            {characterClass === '' && (
              <option value="" disabled>
                Select a class
              </option>
            )}
            {(campaigns[campaign]?.classes ?? []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-4 flex flex-col gap-1">
          <label className={labelClass}>Subclass</label>
          <input
            type="text"
            placeholder="Enter subclass"
            value={subclass}
            onChange={(e) => onSubclassChange(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Row 4: kai level / kai value */}
        <div className="col-span-6 flex flex-col gap-1">
          <label className={labelClass}>{kaiName} Level</label>
          <KaiLevelSelect
            kaiName={kaiName}
            kaiLevels={kaiLevels}
            value={kaiLevel}
            onChange={onKaiLevelChange}
            outOfSync={
              kaiLevel !== '' && (kaiPosition < 0 || kaiPosition > 999)
            }
          />
        </div>
        <div className="col-span-6 flex flex-col gap-1">
          <label className={labelClass}>
            {kaiName} Value
            {kaiLevel !== '' && (
              <>
                <button
                  type="button"
                  onClick={onKaiRoll}
                  className="ml-2 text-xs bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded px-2 py-0.5 transition-opacity cursor-pointer"
                >
                  Roll
                </button>
                <span className="ml-2 text-muted-foreground">
                  Band: {kaiBand(kaiPosition)}
                </span>
              </>
            )}
          </label>
          <input
            type="number"
            min={0}
            disabled={kaiLevel === ''}
            placeholder={
              kaiLevel === ''
                ? `Choose the ${kaiName} level first`
                : `Enter ${kaiName} value`
            }
            value={kaiValue}
            onChange={(e) => onKaiValueChange(e.target.value)}
            className={
              kaiLevel === ''
                ? inputClass + ' opacity-50 cursor-not-allowed'
                : inputClass
            }
          />
        </div>

        {/* Row 5: race / undead */}
        <div className="col-span-8 flex flex-col gap-1">
          <label className={labelClass}>Race</label>
          <select
            value={race}
            onChange={(e) => onRaceChange(e.target.value)}
            className={selectClass}
          >
            {race === '' && (
              <option value="" disabled>
                Select a race
              </option>
            )}
            {(campaigns[campaign]?.races ?? []).map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-4 flex flex-col gap-1">
          <label className={labelClass}>Undead</label>
          <select
            value={undead}
            onChange={(e) => onUndeadChange(e.target.value)}
            className={selectClass}
          >
            {['-------', ...(campaigns[campaign]?.undead ?? [])].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Row 6: level / XP */}
        <div className="col-span-6 flex flex-col gap-1">
          <label className={labelClass}>
            Level
            {kaiLevel !== '' && (
              <span className="ml-2 text-muted-foreground">
                (max {effectiveMaxLevel} due to {kaiName})
              </span>
            )}
          </label>
          <input
            type="number"
            min={1}
            max={effectiveMaxLevel}
            value={level}
            onChange={(e) => onLevelChange(e.target.value)}
            className={
              xpToLevel(xp) !== level
                ? 'w-full bg-secondary border border-destructive text-destructive rounded-lg px-3 py-1.5 focus:outline-none focus:border-destructive'
                : inputClass
            }
          />
        </div>
        <div className="col-span-6 flex flex-col gap-1">
          <label className={labelClass}>
            XP
            {level < effectiveMaxLevel && (
              <span className="ml-2 text-muted-foreground">
                ({fmt((XP_THRESHOLDS[level] ?? 0) - xp)} to next level)
              </span>
            )}
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={fmt(xp)}
            onChange={(e) => onXpChange(e.target.value.replace(/,/g, ''))}
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
