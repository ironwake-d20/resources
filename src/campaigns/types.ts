export type Campaign = 'ironwake' | 'utopia';

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
