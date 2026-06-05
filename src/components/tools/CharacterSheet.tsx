import { useEffect, useState } from 'react';
import * as ironwake from '../../campaigns/ironwake';
import * as utopia from '../../campaigns/utopia';
import type { Campaign, KaiLevel, RacialBonus } from '../../campaigns/types';
import { MAX_LEVEL, XP_THRESHOLDS } from '../../utils/xp';
import AttributesSection, {
  type AttributeMethod,
  type Attributes,
} from './character-sheet/AttributesSection';
import CampaignSection from './character-sheet/CampaignSection';
import IdentitySection from './character-sheet/IdentitySection';

const CAMPAIGN_RACES_DATA = { ironwake: ironwake.races, utopia: utopia.races };

const CAMPAIGN_KAI_NAMES: Record<Campaign, string> = {
  ironwake: ironwake.kaiName,
  utopia: utopia.kaiName,
};
const CAMPAIGN_KAI_LEVELS: Record<Campaign, KaiLevel[]> = {
  ironwake: ironwake.kaiLevels,
  utopia: utopia.kaiLevels,
};

const STORAGE_KEY = 'ironwake-character-sheet';

const DEFAULTS = {
  campaign: 'ironwake' as Campaign,
  characterName: '',
  playerName: '',
  characterClass: '',
  subclass: '',
  lineage: '',
  race: '',
  undead: '-------',
  kaiLevel: '' as number | '',
  kaiValue: '',
  kaiPosition: 0,
  age: '',
  size: 'M',
  height: '',
  weight: '',
  religion: '',
  xp: 0,
  level: 1,
  attributeMethod: 'roll5d6k3' as AttributeMethod,
  attributes: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 } as Attributes,
  asis: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 } as Attributes,
  conditions: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 } as Attributes,
};

function loadSaved() {
  try {
    return {
      ...DEFAULTS,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'),
    };
  } catch {
    return DEFAULTS;
  }
}

export default function CharacterSheet() {
  const saved = loadSaved();
  const [campaign, setCampaign] = useState<Campaign>(saved.campaign);
  const [characterName, setCharacterName] = useState(saved.characterName);
  const [playerName, setPlayerName] = useState(saved.playerName);
  const [characterClass, setCharacterClass] = useState(saved.characterClass);
  const [subclass, setSubclass] = useState(saved.subclass);
  const [lineage, setLineage] = useState(saved.lineage);
  const [race, setRace] = useState(saved.race);
  const [undead, setUndead] = useState(saved.undead);
  const [kaiLevel, setKaiLevel] = useState<number | ''>(saved.kaiLevel);
  const [kaiValue, setKaiValue] = useState(saved.kaiValue);
  const [kaiPosition, setKaiPosition] = useState<number>(
    saved.kaiPosition ?? saved.kaiBandValue ?? 0,
  );
  const [age, setAge] = useState(saved.age);
  const [size, setSize] = useState(saved.size);
  const [height, setHeight] = useState(saved.height);
  const [weight, setWeight] = useState(saved.weight);
  const [religion, setReligion] = useState(saved.religion);
  const [xp, setXp] = useState<number>(saved.xp);
  const [level, setLevel] = useState<number>(saved.level);
  const [attributeMethod, setAttributeMethod] = useState<AttributeMethod>(
    saved.attributeMethod,
  );
  const [attributes, setAttributes] = useState<Attributes>(saved.attributes);
  const [asis, setAsis] = useState<Attributes>(saved.asis ?? DEFAULTS.asis);
  const [conditions, setConditions] = useState<Attributes>(
    saved.conditions ?? DEFAULTS.conditions,
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        campaign,
        characterName,
        playerName,
        characterClass,
        subclass,
        lineage,
        race,
        undead,
        kaiLevel,
        kaiValue,
        kaiPosition,
        age,
        size,
        height,
        weight,
        religion,
        xp,
        level,
        attributeMethod,
        attributes,
        asis,
        conditions,
      }),
    );
  }, [
    campaign,
    characterName,
    playerName,
    characterClass,
    subclass,
    lineage,
    race,
    undead,
    kaiLevel,
    kaiValue,
    kaiPosition,
    age,
    size,
    height,
    weight,
    religion,
    xp,
    level,
    attributeMethod,
    attributes,
    asis,
    conditions,
  ]);

  const racialBonus: RacialBonus =
    CAMPAIGN_RACES_DATA[campaign].find((r) => r.name === race)?.bonus ?? {};

  const effectiveMaxLevel =
    kaiLevel !== ''
      ? (CAMPAIGN_KAI_LEVELS[campaign].find((k) => k.level === kaiLevel)
          ?.maxLevel ?? MAX_LEVEL)
      : MAX_LEVEL;

  function handleCampaignChange(newCampaign: Campaign) {
    setCampaign(newCampaign);
    setCharacterClass('');
    setLineage('');
    setRace('');
    setUndead(DEFAULTS.undead);
    setKaiLevel(DEFAULTS.kaiLevel);
    setKaiValue(DEFAULTS.kaiValue);
    setKaiPosition(DEFAULTS.kaiPosition);
  }

  function handleKaiLevelChange(raw: string) {
    const newKaiLevel = raw === '' ? '' : parseInt(raw);
    setKaiLevel(newKaiLevel);
    setKaiPosition(0);
    if (newKaiLevel !== '') setKaiValue(String(newKaiLevel * 1000));
    const newMax =
      newKaiLevel !== ''
        ? (CAMPAIGN_KAI_LEVELS[campaign].find((k) => k.level === newKaiLevel)
            ?.maxLevel ?? MAX_LEVEL)
        : MAX_LEVEL;
    if (level > newMax) {
      setLevel(newMax);
      setXp(XP_THRESHOLDS[newMax - 1] ?? 0);
    }
  }

  function handleKaiValueChange(raw: string) {
    const val = Math.max(0, parseInt(raw) || 0);
    setKaiValue(String(val));
    if (kaiLevel !== '') setKaiPosition(val - (kaiLevel as number) * 1000);
  }

  function handleKaiRoll() {
    const band = Math.floor(Math.random() * 1000);
    setKaiPosition(band);
    if (kaiLevel !== '')
      setKaiValue(String((kaiLevel as number) * 1000 + band));
  }

  function handleXpChange(raw: string) {
    setXp(Math.max(0, parseInt(raw) || 0));
  }

  function handleLevelChange(raw: string) {
    const newLevel = Math.min(
      effectiveMaxLevel,
      Math.max(1, parseInt(raw) || 1),
    );
    setLevel(newLevel);
    setXp(XP_THRESHOLDS[newLevel - 1] ?? 0);
  }

  function handleRestart() {
    localStorage.removeItem(STORAGE_KEY);
    setCharacterName(DEFAULTS.characterName);
    setPlayerName(DEFAULTS.playerName);
    setCharacterClass(DEFAULTS.characterClass);
    setSubclass(DEFAULTS.subclass);
    setLineage(DEFAULTS.lineage);
    setRace(DEFAULTS.race);
    setUndead(DEFAULTS.undead);
    setKaiLevel(DEFAULTS.kaiLevel);
    setKaiValue(DEFAULTS.kaiValue);
    setKaiPosition(DEFAULTS.kaiPosition);
    setAge(DEFAULTS.age);
    setSize(DEFAULTS.size);
    setHeight(DEFAULTS.height);
    setWeight(DEFAULTS.weight);
    setReligion(DEFAULTS.religion);
    setXp(DEFAULTS.xp);
    setLevel(DEFAULTS.level);
    setAttributeMethod(DEFAULTS.attributeMethod);
    setAttributes(DEFAULTS.attributes);
    setAsis(DEFAULTS.asis);
    setConditions(DEFAULTS.conditions);
  }

  function handleAttributeChange(key: keyof Attributes, value: number) {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  }

  function handleAttributeSwap(key1: keyof Attributes, key2: keyof Attributes) {
    setAttributes((prev) => ({
      ...prev,
      [key1]: prev[key2],
      [key2]: prev[key1],
    }));
  }

  function handleAsiChange(key: keyof Attributes, value: number) {
    setAsis((prev) => ({ ...prev, [key]: value }));
  }

  function handleConditionChange(key: keyof Attributes, value: number) {
    setConditions((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-ctp-text mb-1">
            Character Sheet{' '}
            <button
              onClick={handleRestart}
              className="bg-ctp-surface0 hover:bg-ctp-red text-ctp-subtext1 hover:text-ctp-base text-sm font-semibold rounded-lg px-4 py-2 transition-colors cursor-pointer"
            >
              Restart from scratch
            </button>
          </h2>
          <p className="text-ctp-subtext1">
            Create and manage character sheets for your campaign.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl">
        <CampaignSection campaign={campaign} onChange={handleCampaignChange} />

        <IdentitySection
          campaign={campaign}
          characterName={characterName}
          onCharacterNameChange={setCharacterName}
          playerName={playerName}
          onPlayerNameChange={setPlayerName}
          age={age}
          onAgeChange={setAge}
          size={size}
          onSizeChange={setSize}
          height={height}
          onHeightChange={setHeight}
          weight={weight}
          onWeightChange={setWeight}
          religion={religion}
          onReligionChange={setReligion}
          lineage={lineage}
          onLineageChange={setLineage}
          characterClass={characterClass}
          onCharacterClassChange={setCharacterClass}
          subclass={subclass}
          onSubclassChange={setSubclass}
          race={race}
          onRaceChange={setRace}
          undead={undead}
          onUndeadChange={setUndead}
          kaiName={CAMPAIGN_KAI_NAMES[campaign]}
          kaiLevels={CAMPAIGN_KAI_LEVELS[campaign]}
          kaiLevel={kaiLevel}
          onKaiLevelChange={handleKaiLevelChange}
          kaiValue={kaiValue}
          onKaiValueChange={handleKaiValueChange}
          kaiPosition={kaiPosition}
          onKaiRoll={handleKaiRoll}
          effectiveMaxLevel={effectiveMaxLevel}
          level={level}
          onLevelChange={handleLevelChange}
          xp={xp}
          onXpChange={handleXpChange}
        />

        <AttributesSection
          method={attributeMethod}
          onMethodChange={(m) => {
            setAttributeMethod(m);
            if (m === 'pointbuy') {
              setAttributes({
                str: 8,
                dex: 8,
                con: 8,
                int: 8,
                wis: 8,
                cha: 8,
              });
            } else {
              setAttributes({
                str: 1,
                dex: 1,
                con: 1,
                int: 1,
                wis: 1,
                cha: 1,
              });
            }
          }}
          attributes={attributes}
          onAttributeChange={handleAttributeChange}
          onAttributeSwap={handleAttributeSwap}
          racialBonus={racialBonus}
          kaiLevel={kaiLevel}
          level={level}
          asis={asis}
          onAsiChange={handleAsiChange}
          conditions={conditions}
          onConditionChange={handleConditionChange}
        />
      </div>
    </div>
  );
}
