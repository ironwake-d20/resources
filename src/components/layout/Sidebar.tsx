import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <aside
      className={`shrink-0 border-r border-ctp-surface0 bg-ctp-mantle transition-[width] duration-200 ease-in-out ${
        collapsed ? 'w-12' : 'w-64'
      }`}
    >
      <div className="sticky top-0 flex flex-col">
        <div
          className={`flex items-center p-2 ${
            collapsed ? 'justify-center' : 'justify-end'
          }`}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-2 rounded-lg text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text transition-colors cursor-pointer leading-none"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {!collapsed && (
          <nav className="px-3 py-2 text-sm text-ctp-subtext0">
            {/* Navigation links and campaign tools will live here. */}
          </nav>
        )}
      </div>
    </aside>
  );
}
