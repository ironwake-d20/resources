declare module 'virtual:campaigns' {
  interface KaiLevel {
    level: number;
    name: string;
    maxLevel: number;
  }

  interface RacialBonus {
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    cha?: number;
    vitality?: number;
  }

  type ManaAttribute = 'int' | 'wis' | 'cha';

  interface ClassBonus {
    wounds?: number;
    vitality?: number;
    manaEnabled?: boolean;
    manaAttribute?: ManaAttribute;
  }

  interface Race {
    name: string;
    bonus: RacialBonus;
  }

  interface CampaignData {
    classes: string[];
    classBonuses: Record<string, ClassBonus>;
    lineages: string[];
    races: Race[];
    undead: string[];
    kaiName: string;
    kaiLevels: KaiLevel[];
  }

  export const campaigns: Record<string, CampaignData>;
  export const campaignNames: string[];
}
