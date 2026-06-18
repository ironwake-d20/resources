import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar dark={dark} onToggleDark={() => setDark((d) => !d)} />
      <main className="flex-1 min-w-0">
        <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dice-roller/" element={<DiceRoller />} />
            <Route path="/character-sheet/" element={<CharacterSheet />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
