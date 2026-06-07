interface ChangeableRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  decDisabled?: boolean;
  incDisabled?: boolean;
  signed?: boolean;
  formatValue?: (value: number) => string | number;
}

interface ConstantRowProps {
  label: string;
  value: number;
  signed?: boolean;
  formatValue?: (value: number) => string | number;
  tooltip?: React.ReactNode;
}

const rowButtonClass =
  'flex items-center justify-center w-4 h-4 rounded bg-ctp-surface1 border border-ctp-surface2 text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-surface2 transition-colors text-xs font-bold cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed';

function formatSigned(value: number): string | number {
  return value >= 0 ? `+${value}` : value;
}

export function ChangeableRow({
  label,
  value,
  onChange,
  decDisabled,
  incDisabled,
  signed = true,
  formatValue,
}: ChangeableRowProps) {
  const fmt = formatValue ?? (signed ? formatSigned : (v: number) => v);
  return (
    <div className="flex justify-between items-center text-xs text-ctp-subtext1">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <button
          disabled={decDisabled}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onChange(value - 1)}
          className={rowButtonClass}
        >
          −
        </button>
        <span className="w-5 text-center">{fmt(value)}</span>
        <button
          disabled={incDisabled}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onChange(value + 1)}
          className={rowButtonClass}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function ConstantRow({
  label,
  value,
  signed = true,
  formatValue,
  tooltip,
}: ConstantRowProps) {
  const fmt = formatValue ?? (signed ? formatSigned : (v: number) => v);
  return (
    <div className="flex justify-between text-xs text-ctp-subtext1">
      <span>{label}</span>
      {tooltip ? (
        <span className="relative group inline-flex">
          <span className="underline decoration-dotted decoration-ctp-subtext0 cursor-help">
            {fmt(value)}
          </span>
          <span className="absolute bottom-full right-0 mb-1 hidden group-hover:flex gap-1 items-center bg-ctp-surface1 border border-ctp-surface2 rounded-lg px-2 py-1 z-20 shadow-lg whitespace-nowrap">
            {tooltip}
          </span>
        </span>
      ) : (
        <span>{fmt(value)}</span>
      )}
    </div>
  );
}
