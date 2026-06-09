export type Campaign = string;

export interface KaiLevel {
  level: number;
  name: string;
  maxLevel: number;
}

export interface RacialBonus {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  vitality?: number;
}

export type ManaAttribute = 'int' | 'wis' | 'cha';

export interface ClassBonus {
  wounds?: number;
  vitality?: number;
  manaEnabled?: boolean;
  manaAttribute?: ManaAttribute;
}

export interface Race {
  name: string;
  bonus: RacialBonus;
}

/** Shape of a single campaign's data as parsed from its YAML file. */
export interface CampaignData {
  classes: string[];
  classBonuses: Record<string, ClassBonus>;
  lineages: string[];
  races: Race[];
  undead: string[];
  kaiName: string;
  kaiLevels: KaiLevel[];
}
