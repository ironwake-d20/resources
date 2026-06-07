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

export interface ClassBonus {
  wounds?: number;
  vitality?: number;
}

export interface Race {
  name: string;
  bonus: RacialBonus;
}
