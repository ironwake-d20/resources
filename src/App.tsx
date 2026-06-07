import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import Sidebar from './components/layout/Sidebar';
import Home from './components/Home';
import DiceRoller from './components/tools/DiceRoller';
import CharacterSheet from './components/tools/CharacterSheet';

export default function App() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('mocha', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text flex flex-col">
      <AppHeader dark={dark} onToggleDark={() => setDark((d) => !d)} />
      <div className="flex-1 flex w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 py-8 sm:px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dice-roller" element={<DiceRoller />} />
            <Route path="/character-sheet" element={<CharacterSheet />} />
          </Routes>
        </main>
      </div>
      <AppFooter />
    </div>
  );
}
