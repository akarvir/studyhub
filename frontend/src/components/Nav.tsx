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
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-gray-800">StudyHub</Link>
        <nav className="flex gap-4 text-sm">
          {tabs.map(t => (
            <Link key={t.to} to={t.to}
              className={`px-3 py-1.5 rounded-lg hover:bg-gray-100 ${pathname===t.to ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`}>{t.label}</Link>
          ))}
        </nav>
        <UserMenu />
      </div>
    </header>
  )
}