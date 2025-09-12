import { FormEvent, useEffect, useState } from 'react'
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api'
import Card from '@/components/Card'

type Note = { id: string; title?: string; content?: string; created_at: string }

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  async function load() {
    const data = await apiGet<Note[]>("/notes/")
    setNotes(data)
  }

  useEffect(() => { load() }, [])

  async function create(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
        alert("Deck title is required")
        return
      }
    await apiPost<Note>("/notes/", { title, content })
    setTitle(''); setContent('')
    await load()
  }

  async function update(id: string, title?: string, content?: string) {
    await apiPatch<Note>(`/notes/${id}`, { title, content })
    await load()
  }

  async function remove(id: string) {
    await apiDelete(`/notes/${id}`)
    await load()
  }

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Notes</h1>

      <Card>
        <form onSubmit={create} className="grid gap-3 md:grid-cols-2">
          <input className="border rounded-lg px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <div className="md:col-span-2">
            <textarea className="border rounded-lg px-3 py-2 w-full" rows={4} placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
          </div>
          <div className="md:col-span-2"><button className="btn">Add note</button></div>
        </form>
      </Card>

      <div className="grid gap-4">
        {notes.map(n => (
          <Card key={n.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{n.title || 'Untitled'}</div>
                <div className="text-sm text-gray-600 whitespace-pre-line">{n.content}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-outline" onClick={() => update(n.id, (n.title||'') + ' ✏️')}>Edit</button>
                <button className="btn-outline" onClick={() => remove(n.id)}>Delete</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
