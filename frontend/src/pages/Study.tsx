// src/pages/Study.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGet } from '@/lib/api'
import Card from '@/components/Card'

type CardItem = { id: string; front: string; back: string; created_at?: string }

export default function Study() {
  const { deckId } = useParams<{ deckId: string }>()
  const [cards, setCards] = useState<CardItem[]>([])
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!deckId) return
      setLoading(true)
      setError(null)
      try {
        const data = await apiGet<CardItem[]>(`/decks/${deckId}/cards`)
        if (!active) return
        setCards(data)
        setIndex(0)
        setShowBack(false)
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'Failed to load cards')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [deckId])

  // Keyboard: Left/Right arrows to navigate, Space to flip
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!cards.length) return
      if (e.key === 'ArrowRight') {
        setIndex(i => Math.min(cards.length - 1, i + 1))
        setShowBack(false)
      } else if (e.key === 'ArrowLeft') {
        setIndex(i => Math.max(0, i - 1))
        setShowBack(false)
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        setShowBack(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cards.length])

  if (!deckId) return <div className="p-6">Missing deck id.</div>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Study</h1>

      {loading && <div className="text-gray-600">Loading cards…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && cards.length === 0 && (
        <div className="text-gray-600">No cards in this deck.</div>
      )}

      {!loading && !error && cards.length > 0 && (
        <>
          <Card>
            <div
              className="min-h-[220px] md:min-h-[260px] flex items-center justify-center text-xl md:text-2xl font-semibold cursor-pointer select-none p-6 text-center"
              title="Click to flip"
              onClick={() => setShowBack(v => !v)}
            >
              {showBack ? cards[index].back : cards[index].front}
            </div>
          </Card>

          <div className="flex items-center justify-between mt-4 gap-3">
            <button
              className="btn-outline"
              disabled={index === 0}
              onClick={() => {
                setIndex(i => Math.max(0, i - 1))
                setShowBack(false)
              }}
            >
              Prev
            </button>

            <div className="text-sm text-gray-600">
              {index + 1} / {cards.length}
            </div>

            <button
              className="btn"
              disabled={index === cards.length - 1}
              onClick={() => {
                setIndex(i => Math.min(cards.length - 1, i + 1))
                setShowBack(false)
              }}
            >
              Next
            </button>
          </div>

          <div className="mt-3 flex justify-center">
            <button
              className="btn-outline"
              onClick={() => setShowBack(v => !v)}
            >
              {showBack ? 'Show Front' : 'Show Back'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
