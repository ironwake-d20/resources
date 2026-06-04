import type { KaiLevel, Race } from './types'

export const classes = ['Fighter', 'Healer', 'Spellcaster', 'Rogue']

export const lineages = [
  'Church-raised',
  'Guild-born',
  'Frontier-settled',
  'Urban-underclass',
  'Nomadic',
  'Academic',
  'Military',
]

export const races: Race[] = [
  { name: 'Human', bonus: {} },
  { name: 'Dwarf', bonus: { con: 2, str: 1 } },
  { name: 'Elf', bonus: { dex: 2, int: 1 } },
  { name: 'Sabbia', bonus: { con: 2, dex: 1 } },
]

export const undead = ['Vampire', 'Lich']

export const kaiName = 'Kai'

export const kaiLevels: KaiLevel[] = [
  { level: 4, name: 'Forge', maxLevel: 17 },
  { level: 5, name: 'Blaze', maxLevel: 20 },
  { level: 6, name: 'Pyre', maxLevel: 30 },
  { level: 7, name: 'Inferno', maxLevel: 40 },
  { level: 8, name: 'Conflagration', maxLevel: 60 },
  { level: 9, name: 'Stellar', maxLevel: 80 },
]
