import type { ClassBonus, KaiLevel, Race } from './types';

export const classes = ['Fighter', 'Healer', 'Spellcaster', 'Rogue'];

export const classBonuses: Record<string, ClassBonus> = {
  Fighter: { wounds: 2, vitality: 2 },
  Healer: { wounds: 1, vitality: 1 },
  Spellcaster: { wounds: 0, vitality: 0 },
  Rogue: { wounds: 0, vitality: 1 },
};

export const lineages = [
  'Church-raised',
  'Guild-born',
  'Frontier-settled',
  'Urban-underclass',
  'Nomadic',
  'Academic',
  'Military',
];

export const races: Race[] = [
  { name: 'Human', bonus: { vitality: 1 } },
  { name: 'Dwarf', bonus: { con: 2, str: 1, vitality: 2 } },
  { name: 'Elf', bonus: { dex: 2, int: 1, vitality: 0 } },
  { name: 'Sabbia', bonus: { con: 2, dex: 1, vitality: 2 } },
];

export const undead = ['Vampire', 'Lich'];

export const kaiName = 'Kai';

export const kaiLevels: KaiLevel[] = [
  { level: 4, name: 'Forge', maxLevel: 17 },
  { level: 5, name: 'Blaze', maxLevel: 20 },
  { level: 6, name: 'Pyre', maxLevel: 30 },
  { level: 7, name: 'Inferno', maxLevel: 40 },
  { level: 8, name: 'Conflagration', maxLevel: 60 },
  { level: 9, name: 'Stellar', maxLevel: 80 },
];
