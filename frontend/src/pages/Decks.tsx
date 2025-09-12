import { FormEvent, useEffect, useState } from 'react'
import { apiGet, apiPost } from '@/lib/api'
import Card from '@/components/Card'
import { Link } from 'react-router-dom'

type Deck = { id: string; title: string; description?: string; created_at: string }
type DeckInvite = {
    id: string
    deck_id: string
    inviter_id: string
    permission: 'view' | 'edit'
    status: string
    created_at: string
    deck?: { id: string; title: string; description?: string }
  }


type CardItem = { id: string; front: string; back: string; created_at: string }

export default function Decks() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [inviteUserId, setInviteUserId] = useState('')
  const [permission, setPermission] = useState<'view' | 'edit'>('view')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invites, setInvites] = useState<DeckInvite[]>([])


  const [selected, setSelected] = useState<string>('')
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')

  const [cards, setCards] = useState<CardItem[]>([])
  const [loadingCards, setLoadingCards] = useState(false)

  async function loadDecks() {
    const data = await apiGet<Deck[]>("/decks/")
    setDecks(data)
  }

  async function loadInvites() {
    const data = await apiGet<DeckInvite[]>('/decks/invites')
    setInvites(data)
  }
  
  useEffect(() => {
    loadInvites()
  }, [])

  async function acceptInvite(inviteId: string) {
    await apiPost(`/decks/invites/${inviteId}/accept`, {})
    await loadInvites()
    await loadDecks() // refresh deck list after accepting
  }
  
  async function declineInvite(inviteId: string) {
    await apiPost(`/decks/invites/${inviteId}/decline`, {})
    await loadInvites()
  }
  

  async function loadCards(deckId: string) {
    setLoadingCards(true)
    try {
      const data = await apiGet<CardItem[]>(`/decks/${deckId}/cards`)
      setCards(data)
    } finally { setLoadingCards(false) }
  }

  useEffect(() => { loadDecks() }, [])
  useEffect(() => { if (selected) loadCards(selected) }, [selected])



  async function addCard(e: FormEvent) {
    e.preventDefault()
    if (!selected) return alert('Select a deck first')
    await apiPost<CardItem>(`/decks/${selected}/cards`, { front, back })
    setFront(''); setBack('')
    await loadCards(selected)
  }

  async function createDeck(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      alert("Deck title is required")
      return
    }
    await apiPost<Deck>("/decks/", { title: title.trim(), description: description.trim() })
    setTitle('')
    setDescription('')
    await loadDecks()
  }
  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Decks</h1>
  
      <Card>
        <form onSubmit={createDeck} className="grid gap-3 md:grid-cols-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Deck title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <button className="btn">Create deck</button>
        </form>
      </Card>
  
      <div className="grid md:grid-cols-2 gap-4">
  
        {/* Deck Invitations */}
        <Card>
          <h2 className="font-medium mb-2">Deck Invitations</h2>
          <ul className="space-y-2">
            {invites.map(invite => (
              <li key={invite.id} className="p-3 border rounded-lg">
                <div className="font-medium">{invite.deck?.title || "Untitled Deck"}</div>
                <div className="text-sm text-gray-600">Permission: {invite.permission}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => acceptInvite(invite.id)} className="btn btn-sm">Accept</button>
                  <button onClick={() => declineInvite(invite.id)} className="btn btn-sm">Decline</button>
                </div>
              </li>
            ))}
            {!invites.length && (
              <div className="text-sm text-gray-500">No pending invitations.</div>
            )}
          </ul>
        </Card>
  
        {/* Your Decks */}
        <Card>
          <h2 className="font-medium mb-2">Your Decks</h2>
          <ul className="space-y-2">
            {decks.map(d => (
              <li key={d.id}>
                <button onClick={()=>setSelected(d.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg border ${selected===d.id? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="font-medium">{d.title}</div>
                  {d.description && <div className="text-sm text-gray-600">{d.description}</div>}
                  <Link to={`/study/${d.id}`} className="text-sm text-gray-600">Study</Link>
                </button>
              </li>
            ))}
          </ul>
        </Card>
  
        {/* Add Card */}
        <Card>
          <h2 className="font-medium mb-2">Add Card to Selected Deck</h2>
          <form onSubmit={addCard} className="grid gap-3">
            <input className="border rounded-lg px-3 py-2" placeholder="Front" value={front} onChange={e=>setFront(e.target.value)} />
            <input className="border rounded-lg px-3 py-2" placeholder="Back" value={back} onChange={e=>setBack(e.target.value)} />
            <button className="btn">Add card</button>
          </form>
  
          <div className="h-px bg-gray-100 my-4" />
          <h3 className="font-medium mb-2">Cards {selected && `(Deck ${selected.slice(0,8)}…)`}</h3>
          {loadingCards ? (
            <div className="text-sm text-gray-600">Loading cards…</div>
          ) : (
            <ul className="space-y-2 max-h-72 overflow-auto pr-1">
              {cards.map(c => (
                <li key={c.id} className="p-3 border rounded-lg">
                  <div className="font-medium">{c.front}</div>
                  <div className="text-sm text-gray-600">{c.back}</div>
                </li>
              ))}
              {!cards.length && <div className="text-sm text-gray-500">No cards yet.</div>}
            </ul>
          )}
        </Card>
  
        {/* Share Deck */}
        <Card>
          <h2 className="font-medium mb-2">Share Selected Deck</h2>
          {!selected && <div className="text-sm text-gray-500">Select a deck first.</div>}
          {selected && (
            <form onSubmit={async e => {
              e.preventDefault()
              if (!inviteEmail.trim()) return
              await apiPost(`/decks/${selected}/invite`, { email: inviteEmail.trim(), permission })
              setInviteEmail('')
              alert('Invitation sent to ' + inviteEmail.trim())
            }} className="grid gap-3">
              <input
                className="border rounded-lg px-3 py-2"
                placeholder="User Email"
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
              <select
                className="border rounded-lg px-3 py-2"
                value={permission}
                onChange={e => setPermission(e.target.value as 'view' | 'edit')}
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
              </select>
              <button className="btn">Share</button>
            </form>
          )}
        </Card>
  
      </div>
    </div>
  )
}