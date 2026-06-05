import { Link } from 'react-router-dom';

interface AppHeaderProps {
  dark: boolean;
  onToggleDark: () => void;
}

export default function AppHeader({ dark, onToggleDark }: AppHeaderProps) {
  return (
    <header className="bg-ctp-mantle border-b border-ctp-surface0 px-6 py-3 flex items-center justify-between">
      <Link
        to="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <span className="text-2xl leading-none">⚔️</span>
        <span className="text-lg font-semibold text-ctp-mauve">
          Ironwake Resources
        </span>
      </Link>
      <button
        onClick={onToggleDark}
        className="p-2 rounded-lg bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-subtext1 hover:text-ctp-text transition-colors cursor-pointer"
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
