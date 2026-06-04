import { Link } from 'react-router-dom'

interface Tool {
  emoji: string
  title: string
  description: string
  href: string
  external?: boolean
}

const tools: Tool[] = [
  {
    emoji: '🎲',
    title: 'Dice Roller',
    description: 'Roll and keep dice for any purpose.',
    href: '/dice-roller',
  },
  {
    emoji: '📜',
    title: 'Character Sheet',
    description: 'Create and manage character sheets for your campaign.',
    href: '/character-sheet',
  },
]

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-ctp-text mb-1">Tools</h2>
      <p className="text-ctp-subtext1 mb-8">A collection of tools for your Ironwake campaign.</p>
      <ul className="flex flex-col gap-3">
        {tools.map((tool) => (
          <li
            key={tool.title}
            className="bg-ctp-mantle rounded-xl border border-ctp-surface0 hover:border-ctp-surface2 transition-colors p-4 flex items-start gap-4"
          >
            <span className="text-2xl leading-none mt-0.5 select-none">{tool.emoji}</span>
            <div className="flex-1 min-w-0">
              {tool.external ? (
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ctp-blue hover:text-ctp-sky transition-colors"
                >
                  {tool.title}
                </a>
              ) : (
                <Link
                  to={tool.href}
                  className="font-semibold text-ctp-blue hover:text-ctp-sky transition-colors"
                >
                  {tool.title}
                </Link>
              )}
              <p className="text-sm text-ctp-subtext1 mt-0.5">{tool.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
