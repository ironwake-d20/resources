import { useEffect, useRef, useState } from 'react'
import type { KaiLevel } from '../../../campaigns/types'
import { selectClass } from './styles'

const outOfSyncClass =
  'w-full bg-ctp-surface0 border border-ctp-red text-ctp-red rounded-lg px-3 py-1.5 focus:outline-none focus:border-ctp-red text-left flex items-center justify-between gap-2'

interface Props {
  kaiName: string
  kaiLevels: KaiLevel[]
  value: number | ''
  onChange: (raw: string) => void
  outOfSync?: boolean
}

export default function KaiLevelSelect({ kaiName, kaiLevels, value, onChange, outOfSync }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = kaiLevels.find((k) => k.level === value)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          outOfSync
            ? outOfSyncClass
            : selectClass + ' text-left flex items-center justify-between gap-2'
        }
      >
        <span className={selected ? '' : 'text-ctp-subtext0'}>
          {selected ? `${selected.level} – ${selected.name}` : `Select a ${kaiName} level`}
        </span>
        <span className="text-xs opacity-60">▾</span>
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-1 bg-ctp-surface0 border border-ctp-surface2 rounded-lg overflow-hidden shadow-lg">
          {kaiLevels.map((k) => (
            <li key={k.level}>
              <button
                type="button"
                onClick={() => {
                  onChange(String(k.level))
                  setOpen(false)
                }}
                className="w-full text-left px-3 py-1.5 text-sm text-ctp-text hover:bg-ctp-surface1 transition-colors"
              >
                {k.level} – {k.name} (max lvl {k.maxLevel})
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
