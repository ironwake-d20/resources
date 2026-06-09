import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { load as parseYaml } from 'js-yaml';
import type { Plugin } from 'vite';

const VIRTUAL_MODULE_ID = 'virtual:campaigns';
const RESOLVED_ID = '\0' + VIRTUAL_MODULE_ID;

function getCampaignsDir(): string {
  return resolve(import.meta.dirname, 'src', 'campaigns');
}

interface LoadResult {
  campaigns: Record<string, unknown>;
  campaignNames: string[];
}

function loadAllCampaigns(): LoadResult {
  const dir = getCampaignsDir();
  const files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  const campaigns: Record<string, unknown> = {};

  for (const file of files) {
    const name = file.replace(/\.yaml$/, '');
    const content = readFileSync(resolve(dir, file), 'utf-8');
    campaigns[name] = parseYaml(content);
  }

  return {
    campaigns,
    campaignNames: Object.keys(campaigns).sort(),
  };
}

export default function campaignsPlugin(): Plugin {
  return {
    name: 'vite-plugin-campaigns',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
      return undefined;
    },

    load(id) {
      if (id !== RESOLVED_ID) return undefined;

      const dir = getCampaignsDir();
      const yamlFiles = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
      for (const file of yamlFiles) {
        this.addWatchFile(resolve(dir, file));
      }

      const data = loadAllCampaigns();

      return [
        `export const campaigns = ${JSON.stringify(data.campaigns)};`,
        `export const campaignNames = ${JSON.stringify(data.campaignNames)};`,
      ].join('\n');
    },
  };
}
