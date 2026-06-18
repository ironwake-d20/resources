import { labelClass, selectClass } from './styles';

interface Props {
  campaign: string;
  campaignNames: string[];
  onChange: (campaign: string) => void;
}

export default function CampaignSection({
  campaign,
  campaignNames,
  onChange,
}: Props) {
  return (
    <section className="bg-card rounded-xl border p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-foreground">Campaign</h3>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Campaign</label>
        <select
          value={campaign}
          onChange={(e) => onChange(e.target.value)}
          className={selectClass}
        >
          {campaignNames.map((name) => (
            <option key={name} value={name}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
