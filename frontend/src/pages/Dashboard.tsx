import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/api'
import Card from '@/components/Card'
import { Link } from 'react-router-dom'

type Deck = { id: string; title: string; description?: string }
type Note = { id: string; title?: string; content?: string }
type Group = { id: string; name: string; description?: string }

export default function Dashboard() {
  const [counts, setCounts] = useState<{notes: number; decks: number} | null>(null)
  const [recentDecks, setRecentDecks] = useState<Deck[]>([])
  const [recentNotes, setRecentNotes] = useState<Note[]>([])
  const [recentGroups, setRecentGroups] = useState<Group[]>([])
  const [tipOfDay, setTipOfDay] = useState<string>('')
  const [showTip, setShowTip] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      try {
        const notes = await apiGet<Note[]>("/notes/")
        const decks = await apiGet<Deck[]>("/decks/")
        setCounts({ notes: notes.length, decks: decks.length })
        setRecentNotes(notes.slice(0, 3))
        setRecentDecks(decks.slice(0, 3))
      } catch (e) { console.error(e) }
      try {
        const groups = await apiGet<Group[]>("/groups/")
        setRecentGroups(groups.slice(0, 3))
      } catch (e) { console.error(e) }
    })()
    const TIPS = [
      'Short daily sessions beat long cramming — consistency wins.',
      'Recall > reread: test yourself before peeking at notes.',
      'Space reviews: today, 2 days, 1 week, then monthly.',
      'Interleave topics to strengthen transfer and retention.',
      'Teach it to a rubber duck — if you can explain it, you own it.',
      'Make cards atomic: one fact or concept per card.',
      'Vary context: study in different places to reduce context dependence.',
      'Use images or examples on the back of flashcards for richer cues.',
      'Rate your confidence after each card to guide scheduling.',
      'Sleep is a study technique — review before bed for consolidation.',
      'Turn notes into questions; questions drive memory.',
      'Tag tricky cards as “leeches” and rework them into simpler parts.',
      'Define a tiny daily goal (5 minutes). Start small, keep streaks.',
      'Write down errors — analyzing mistakes boosts learning gains.',
      'Chunk complex ideas into layered cards that build up gradually.'
    ]
    // Daily persistence: store dismiss state and selected tip for the day
    const todayKey = new Date().toISOString().slice(0, 10)
    const stored = localStorage.getItem('dashboard.tip')
    try {
      const parsed = stored ? JSON.parse(stored) as { date: string; hidden: boolean; tip: string } : null
      if (parsed && parsed.date === todayKey) {
        setShowTip(!parsed.hidden)
        setTipOfDay(parsed.tip)
      } else {
        const tip = TIPS[Math.floor(Math.random() * TIPS.length)]
        setTipOfDay(tip)
        localStorage.setItem('dashboard.tip', JSON.stringify({ date: todayKey, hidden: false, tip }))
      }
    } catch {
      const tip = TIPS[Math.floor(Math.random() * TIPS.length)]
      setTipOfDay(tip)
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of your StudyHub activity</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="kpi">
          <div>
            <div className="text-gray-500 text-sm">Your Notes</div>
            <div className="text-3xl font-semibold">{counts?.notes ?? '—'}</div>
          </div>
          <span className="badge">+ Focus</span>
        </div>
        <div className="kpi">
          <div>
            <div className="text-gray-500 text-sm">Your Decks</div>
            <div className="text-3xl font-semibold">{counts?.decks ?? '—'}</div>
          </div>
          <span className="badge">Study</span>
        </div>
        {showTip && (
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">🎯</div>
              <div className="flex-1">
                <div className="font-medium">Tip of the day</div>
                <div className="text-sm text-gray-600">{tipOfDay}</div>
              </div>
              <button
                className="btn-ghost"
                onClick={() => {
                  setShowTip(false)
                  const todayKey = new Date().toISOString().slice(0, 10)
                  try {
                    localStorage.setItem('dashboard.tip', JSON.stringify({ date: todayKey, hidden: true, tip: tipOfDay }))
                  } catch {}
                }}
              >
                Dismiss
              </button>
            </div>
          </Card>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Recent Decks</h2>
            <Link to="/decks" className="btn-ghost text-sm">View all</Link>
          </div>
          <ul className="space-y-2">
            {recentDecks.map(d => (
              <li key={d.id} className="p-3 border rounded-lg card-hover">
                <div className="font-medium">{d.title}</div>
                {d.description && <div className="text-sm text-gray-600">{d.description}</div>}
              </li>
            ))}
            {!recentDecks.length && <div className="text-sm text-gray-500">No decks yet.</div>}
          </ul>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Recent Notes</h2>
            <Link to="/notes" className="btn-ghost text-sm">View all</Link>
          </div>
          <ul className="space-y-2">
            {recentNotes.map(n => (
              <li key={n.id} className="p-3 border rounded-lg card-hover">
                <div className="font-medium">{n.title || 'Untitled'}</div>
                {n.content && <div className="text-sm text-gray-600 line-clamp-2">{n.content}</div>}
              </li>
            ))}
            {!recentNotes.length && <div className="text-sm text-gray-500">No notes yet.</div>}
          </ul>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Your Groups</h2>
            <Link to="/groups" className="btn-ghost text-sm">View all</Link>
          </div>
          <ul className="space-y-2">
            {recentGroups.map(g => (
              <li key={g.id} className="p-3 border rounded-lg card-hover">
                <div className="font-medium">{g.name}</div>
                {g.description && <div className="text-sm text-gray-600">{g.description}</div>}
              </li>
            ))}
            {!recentGroups.length && <div className="text-sm text-gray-500">You have no groups yet.</div>}
          </ul>
        </Card>
      </div>
    </div>
  )
}
