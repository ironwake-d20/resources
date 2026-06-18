import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface SidebarProps {
  dark: boolean;
  onToggleDark: () => void;
}

type NavItem = {
  to: string;
  emoji: string;
  label: string;
};

const navItems: NavItem[] = [
  { to: '/', emoji: '⚔️', label: 'Ironwake' },
  { to: '/dice-roller/', emoji: '🎲', label: 'Dice Roller' },
  { to: '/character-sheet/', emoji: '📜', label: 'Character Sheet' },
];

export default function Sidebar({ dark, onToggleDark }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    // Start expanded by default for a “workspace” feel.
    return stored === null ? false : stored === 'true';
  });

  const location = useLocation();
  const pathname = location.pathname || '/';

  const activeTo = useMemo(() => {
    // Exact match for home; prefix match for other routes.
    if (pathname === '/' || pathname === '') return '/';
    const match = navItems.find(
      (i) => i.to !== '/' && pathname.startsWith(i.to),
    );
    return match?.to ?? '/';
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <aside
      className={`shrink-0 border-r bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-[width] duration-200 ease-in-out ${
        collapsed ? 'w-14' : 'w-64'
      }`}
    >
      <div className="sticky top-0 h-screen flex flex-col">
        <div className="px-3 pt-3 pb-2">
          <div
            className={
              collapsed
                ? 'flex justify-center'
                : 'flex items-center justify-between'
            }
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={collapsed ? 'h-9 w-9' : 'h-9 w-9'}
            >
              <span className="text-base leading-none">
                {collapsed ? '›' : '‹'}
              </span>
            </Button>
          </div>
        </div>

        <nav className={collapsed ? 'px-2' : 'px-3'} aria-label="Primary">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = item.to === activeTo;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={
                      collapsed
                        ? [
                            'h-10 w-10 mx-auto flex items-center justify-center rounded-lg transition-colors',
                            active
                              ? 'bg-accent text-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                          ].join(' ')
                        : [
                            'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                            active
                              ? 'bg-accent text-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                          ].join(' ')
                    }
                    aria-current={active ? 'page' : undefined}
                    title={item.label}
                  >
                    <span className="text-lg leading-none select-none">
                      {item.emoji}
                    </span>
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={collapsed ? 'px-2' : 'px-3'}>
          <div className="py-3">
            <Separator />
          </div>
        </div>

        <div className={collapsed ? 'px-2 pb-3 mt-auto' : 'px-3 pb-3 mt-auto'}>
          <Button
            variant="ghost"
            onClick={onToggleDark}
            className={
              collapsed ? 'w-10 h-10 px-0 mx-auto' : 'w-full justify-start'
            }
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="text-base leading-none">{dark ? '☀️' : '🌙'}</span>
            {!collapsed && <span className="text-sm">Theme</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
