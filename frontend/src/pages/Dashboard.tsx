import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/api'
import Card from '@/components/Card'

export default function Dashboard() {
  const [counts, setCounts] = useState<{notes: number; decks: number} | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const notes = await apiGet<any[]>("/notes/")
        const decks = await apiGet<any[]>("/decks/")
        setCounts({ notes: notes.length, decks: decks.length })
      } catch (e) { console.error(e) }
    })()
  }, [])

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card><div className="text-gray-600">Your Notes</div><div className="text-3xl font-semibold">{counts?.notes ?? '—'}</div></Card>
        <Card><div className="text-gray-600">Your Decks</div><div className="text-3xl font-semibold">{counts?.decks ?? '—'}</div></Card>
      </div>
    </div>
  )
}
