import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppHeader from './components/layout/AppHeader'
import AppFooter from './components/layout/AppFooter'
import Home from './components/Home'
import DiceRoller from './components/tools/DiceRoller'
import CharacterSheet from './components/tools/CharacterSheet'

export default function App() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('mocha', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text flex flex-col">
      <AppHeader dark={dark} onToggleDark={() => setDark((d) => !d)} />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dice-roller" element={<DiceRoller />} />
          <Route path="/character-sheet" element={<CharacterSheet />} />
        </Routes>
      </main>
      <AppFooter />
    </div>
  )
}
