import { Link } from 'react-router-dom';

import { Card, CardDescription, CardTitle } from './ui/card';

interface Tool {
  emoji: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

const tools: Tool[] = [
  {
    emoji: '🎲',
    title: 'Dice Roller',
    description: 'Roll and keep dice for any purpose.',
    href: '/dice-roller/',
  },
  {
    emoji: '📜',
    title: 'Character Sheet',
    description: 'Create and manage character sheets for your campaign.',
    href: '/character-sheet/',
  },
];

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-1">Tools</h2>
      <p className="text-muted-foreground mb-8">
        A small, focused set of tools for your Ironwake campaign.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((tool) => (
          <li key={tool.title}>
            <Card className="hover:bg-accent transition-colors">
              <div className="p-4 flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5 select-none">
                  {tool.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  {tool.external ? (
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <CardTitle className="text-base text-foreground group-hover:underline">
                        {tool.title}
                      </CardTitle>
                    </a>
                  ) : (
                    <Link to={tool.href} className="group">
                      <CardTitle className="text-base text-foreground group-hover:underline">
                        {tool.title}
                      </CardTitle>
                    </Link>
                  )}
                  <CardDescription className="mt-1">
                    {tool.description}
                  </CardDescription>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
