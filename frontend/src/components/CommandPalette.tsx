import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Command = { label: string; keywords?: string; action: () => void }

export default function CommandPalette() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = useMemo(() => [
    { label: 'Go to Dashboard', keywords: 'home start', action: () => navigate('/') },
    { label: 'Go to Notes', keywords: 'note', action: () => navigate('/notes') },
    { label: 'Go to Decks', keywords: 'flashcards cards', action: () => navigate('/decks') },
    { label: 'Go to Groups', keywords: 'community leaderboard', action: () => navigate('/groups') },
    { label: 'Create a Note', keywords: 'add new note', action: () => navigate('/notes') },
    { label: 'Create a Deck', keywords: 'add new deck card', action: () => navigate('/decks') },
  ], [navigate])

  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const q = query.toLowerCase()
    return commands.filter(c =>
      c.label.toLowerCase().includes(q) || (c.keywords || '').toLowerCase().includes(q)
    )
  }, [commands, query])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        // Avoid opening when typing in inputs
        const tag = (document.activeElement?.tagName || '').toLowerCase()
        if (tag === 'input' || tag === 'textarea') return
        e.preventDefault()
        setOpen(true); setQuery(''); setActive(0)
      } else if (open) {
        if (e.key === 'Escape') { setOpen(false) }
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, filtered.length - 1)) }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
        if (e.key === 'Enter') {
          e.preventDefault()
          filtered[active]?.action(); setOpen(false)
        }
      }
    }
    function onOpenEvent() { setOpen(true); setQuery(''); setActive(0) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-palette', onOpenEvent as EventListener)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-command-palette', onOpenEvent as EventListener)
    }
  }, [open, filtered, active])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 0) }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative mx-auto max-w-lg mt-24 p-2">
        <div className="card overflow-hidden">
          <div className="p-3 border-b">
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setActive(0) }}
              placeholder="Type a command or search..."
              className="input w-full"
            />
          </div>
          <ul className="max-h-72 overflow-auto">
            {filtered.map((c, i) => (
              <li key={c.label}>
                <button
                  onClick={() => { c.action(); setOpen(false) }}
                  className={`w-full text-left px-3 py-2 ${i===active ? 'bg-brand-50' : 'hover:bg-gray-50'}`}
                >
                  {c.label}
                </button>
              </li>
            ))}
            {!filtered.length && (
              <li className="px-3 py-2 text-sm text-gray-500">No results</li>
            )}
          </ul>
          <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 border-t">
            <div>Use ↑ ↓ to navigate, Enter to select</div>
            <div><kbd className="px-1 py-0.5 rounded border">⌘</kbd> + <kbd className="px-1 py-0.5 rounded border">K</kbd></div>
          </div>
        </div>
      </div>
    </div>
  )
}


