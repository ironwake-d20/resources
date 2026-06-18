import { useEffect, useState } from 'react';
import { campaigns, campaignNames } from 'virtual:campaigns';
import type { RacialBonus } from '../../campaigns/types';
import { MAX_LEVEL, XP_THRESHOLDS } from '../../utils/xp';
import { Button } from '../ui/button';
import AttributesSection, {
  type AttributeMethod,
  type Attributes,
} from './character-sheet/AttributesSection';
import CampaignSection from './character-sheet/CampaignSection';
import IdentitySection from './character-sheet/IdentitySection';
import StatusSection, {
  type StabilisationState,
} from './character-sheet/StatusSection';

const STORAGE_KEY = 'ironwake-character-sheet';

const DEFAULTS = {
  campaign: '' as string,
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
  currentVitality: 0,
  currentWounds: 0,
  woundsCondition: 0,
  vitalityCondition: 0,
  currentMana: 0,
  manaCondition: 0,
  overdrawEvents: 0,
  vitalityRolls: [] as number[],
  stabilisationChecks: [
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
  ] as StabilisationState[],
};

function loadSaved() {
  const defaultCampaign = campaignNames[0] ?? 'ironwake';
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (
      typeof raw.campaign === 'string' &&
      !campaignNames.includes(raw.campaign)
    ) {
      raw.campaign = defaultCampaign;
    }
    return {
      ...DEFAULTS,
      campaign: defaultCampaign,
      ...raw,
    };
  } catch {
    return { ...DEFAULTS, campaign: defaultCampaign };
  }
}

export default function CharacterSheet() {
  const saved = loadSaved();
  const [campaign, setCampaign] = useState<string>(saved.campaign);
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
  const [currentVitality, setCurrentVitality] = useState<number>(
    saved.currentVitality ?? DEFAULTS.currentVitality,
  );
  const [currentWounds, setCurrentWounds] = useState<number>(
    saved.currentWounds ?? DEFAULTS.currentWounds,
  );
  const [woundsCondition, setWoundsCondition] = useState<number>(
    saved.woundsCondition ?? DEFAULTS.woundsCondition,
  );
  const [vitalityCondition, setVitalityCondition] = useState<number>(
    saved.vitalityCondition ?? DEFAULTS.vitalityCondition,
  );
  const [currentMana, setCurrentMana] = useState<number>(
    saved.currentMana ?? DEFAULTS.currentMana,
  );
  const [manaCondition, setManaCondition] = useState<number>(
    saved.manaCondition ?? DEFAULTS.manaCondition,
  );
  const [overdrawEvents, setOverdrawEvents] = useState<number>(
    saved.overdrawEvents ?? DEFAULTS.overdrawEvents,
  );
  const [stabilisationChecks, setStabilisationChecks] = useState<
    StabilisationState[]
  >(saved.stabilisationChecks ?? DEFAULTS.stabilisationChecks);
  const [vitalityRolls, setVitalityRolls] = useState<number[]>(
    saved.vitalityRolls ?? DEFAULTS.vitalityRolls,
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
        currentVitality,
        currentWounds,
        woundsCondition,
        vitalityCondition,
        currentMana,
        manaCondition,
        overdrawEvents,
        vitalityRolls,
        stabilisationChecks,
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
    currentVitality,
    currentWounds,
    woundsCondition,
    vitalityCondition,
    currentMana,
    manaCondition,
    overdrawEvents,
    vitalityRolls,
    stabilisationChecks,
  ]);

  const racialBonus: RacialBonus =
    campaigns[campaign]?.races.find((r) => r.name === race)?.bonus ?? {};

  const conKaiBonus =
    kaiLevel !== '' ? Math.max(0, (kaiLevel as number) - attributes.con) : 0;
  const effectiveConstitution =
    attributes.con +
    conKaiBonus +
    (racialBonus.con ?? 0) +
    (asis.con ?? 0) +
    (conditions.con ?? 0);
  const woundsBase = Math.max(1, Math.floor(effectiveConstitution / 4));
  const woundsKaiBonus = kaiLevel !== '' && kaiLevel >= 6 ? 1 : 0;
  const classBonus = campaigns[campaign]?.classBonuses[characterClass] ?? {};
  const woundsClassBonus = classBonus.wounds ?? 0;
  const conModifier = Math.floor((effectiveConstitution - 10) / 2);
  const vitalityRacialBonus = racialBonus.vitality ?? 0;
  const vitalityClassBonus = classBonus.vitality ?? 0;
  const vitalityKaiBonus = kaiLevel !== '' && kaiLevel >= 7 ? 1 : 0;

  const rollsTotal = vitalityRolls.reduce((a, b) => a + b, 0);
  const levelBonusSum =
    (conModifier +
      vitalityRacialBonus +
      vitalityClassBonus +
      vitalityKaiBonus) *
    level;
  const vitalityMax = Math.max(
    1,
    1 + rollsTotal + levelBonusSum + vitalityCondition,
  );
  const manaEnabled = classBonus.manaEnabled ?? false;
  const manaAttr = classBonus.manaAttribute;

  let manaMax = 0;
  let manaAttrModifier = 0;
  let manaKaiBonus = 0;
  if (manaEnabled && manaAttr) {
    const manaAttrKaiBonus =
      kaiLevel !== ''
        ? Math.max(0, (kaiLevel as number) - attributes[manaAttr])
        : 0;
    const effectiveManaAttr =
      attributes[manaAttr] +
      manaAttrKaiBonus +
      (racialBonus[manaAttr] ?? 0) +
      (asis[manaAttr] ?? 0) +
      (conditions[manaAttr] ?? 0);
    manaAttrModifier = Math.floor((effectiveManaAttr - 10) / 2);
    manaKaiBonus = kaiLevel !== '' && kaiLevel >= 5 ? 1 : 0;
    manaMax = Math.max(
      0,
      10 * level + manaAttrModifier * level + manaKaiBonus + manaCondition,
    );
  }

  const effectiveMaxLevel =
    kaiLevel !== ''
      ? (campaigns[campaign]?.kaiLevels.find((k) => k.level === kaiLevel)
          ?.maxLevel ?? MAX_LEVEL)
      : MAX_LEVEL;

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const expected = level;
    if (vitalityRolls.length === expected) return;
    if (vitalityRolls.length > expected) {
      setVitalityRolls(vitalityRolls.slice(0, expected));
      return;
    }
    const missing = expected - vitalityRolls.length;
    const newRolls = Array.from(
      { length: missing },
      () => Math.floor(Math.random() * 4) + 1,
    );
    setVitalityRolls([...vitalityRolls, ...newRolls]);
  }, [level, vitalityRolls]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (currentVitality < vitalityMax) setCurrentVitality(vitalityMax);
    if (currentMana < manaMax) setCurrentMana(manaMax);
  }, [vitalityMax, manaMax]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  function handleCampaignChange(newCampaign: string) {
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
        ? (campaigns[campaign]?.kaiLevels.find((k) => k.level === newKaiLevel)
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
    setCurrentVitality(DEFAULTS.currentVitality);
    setCurrentWounds(DEFAULTS.currentWounds);
    setWoundsCondition(DEFAULTS.woundsCondition);
    setVitalityCondition(DEFAULTS.vitalityCondition);
    setCurrentMana(DEFAULTS.currentMana);
    setManaCondition(DEFAULTS.manaCondition);
    setOverdrawEvents(DEFAULTS.overdrawEvents);
    setVitalityRolls(DEFAULTS.vitalityRolls);
    setStabilisationChecks(DEFAULTS.stabilisationChecks);
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

  function handleStabilisationCheckChange(
    index: number,
    value: StabilisationState,
  ) {
    setStabilisationChecks((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleStabilisationChecksReset() {
    setStabilisationChecks(DEFAULTS.stabilisationChecks);
  }

  function handleVitalityRerollAll() {
    setVitalityRolls(
      Array.from({ length: level }, () => Math.floor(Math.random() * 4) + 1),
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            Character Sheet
          </h2>
          <p className="text-muted-foreground">
            Create and manage character sheets for your campaign.
          </p>
        </div>
        <Button variant="destructive" size="sm" onClick={handleRestart}>
          Restart
        </Button>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-12 items-start gap-6">
        <div className="2xl:col-span-12">
          <CampaignSection
            campaign={campaign}
            campaignNames={campaignNames}
            onChange={handleCampaignChange}
          />
        </div>

        <div className="2xl:col-span-12">
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
            kaiName={campaigns[campaign]?.kaiName ?? 'Kai'}
            kaiLevels={campaigns[campaign]?.kaiLevels ?? []}
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
        </div>

        <div className="2xl:col-span-4">
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

        <div className="2xl:col-span-8">
          <StatusSection
            level={level}
            vitalityMax={vitalityMax}
            currentVitality={currentVitality}
            onCurrentVitalityChange={setCurrentVitality}
            vitalityConModifier={conModifier}
            vitalityRacialBonus={vitalityRacialBonus}
            vitalityClassBonus={vitalityClassBonus}
            vitalityKaiBonus={vitalityKaiBonus}
            vitalityRolls={vitalityRolls}
            onVitalityRerollAll={handleVitalityRerollAll}
            vitalityCondition={vitalityCondition}
            onVitalityConditionChange={setVitalityCondition}
            woundsBase={woundsBase}
            woundsKaiBonus={woundsKaiBonus}
            woundsClassBonus={woundsClassBonus}
            woundsCondition={woundsCondition}
            currentWounds={currentWounds}
            onCurrentWoundsChange={setCurrentWounds}
            onWoundsConditionChange={setWoundsCondition}
            manaMax={manaMax}
            currentMana={currentMana}
            onCurrentManaChange={setCurrentMana}
            manaEnabled={manaEnabled}
            manaAttrModifier={manaAttrModifier}
            manaKaiBonus={manaKaiBonus}
            manaCondition={manaCondition}
            onManaConditionChange={setManaCondition}
            overdrawEvents={overdrawEvents}
            onOverdrawEventsChange={setOverdrawEvents}
            stabilisationChecks={stabilisationChecks}
            onStabilisationCheckChange={handleStabilisationCheckChange}
            onStabilisationChecksReset={handleStabilisationChecksReset}
          />
        </div>
      </div>
    </div>
  );
}
