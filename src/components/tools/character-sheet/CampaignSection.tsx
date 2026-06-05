import type { Campaign } from '../../../campaigns/types';
import { labelClass, selectClass } from './styles';

interface Props {
  campaign: Campaign;
  onChange: (campaign: Campaign) => void;
}

export default function CampaignSection({ campaign, onChange }: Props) {
  return (
    <section className="bg-ctp-mantle rounded-xl border border-ctp-surface0 p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-ctp-text">Campaign</h3>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Campaign</label>
        <select
          value={campaign}
          onChange={(e) => onChange(e.target.value as Campaign)}
          className={selectClass}
        >
          <option value="ironwake">Ironwake</option>
          <option value="utopia">Utopia</option>
        </select>
      </div>
    </section>
  );
}
