import { Link, useLocation } from 'react-router-dom'
import UserMenu from '@/components/UserMenu'

const tabs = [
  { to: '/', label: 'Dashboard' },
  { to: '/notes', label: 'Notes' },
  { to: '/decks', label: 'Decks' },
  { to: '/groups', label: 'Groups' }
]

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-brand-600 text-white text-xs">SH</span>
          <span style={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}>StudyHub</span>
        </Link>
        <nav className="flex gap-1 text-sm">
          {tabs.map(t => (
            <Link key={t.to} to={t.to}
              className={`px-3 py-2 rounded-lg transition ${pathname===t.to ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>{t.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost hidden md:inline-flex"
            onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
            aria-label="Open command palette"
          >
            ⌘K
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}