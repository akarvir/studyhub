import { FormEvent, useEffect, useState } from 'react'
import { apiGet, apiPost } from '@/lib/api'
import Card from '@/components/Card'

type Group = { id: string; name: string; description?: string; created_at: string }
type GroupPost = { id: string; group_id: string; author_id: string; content: string; created_at: string }
type ScoreEntry = { user_id: string; username: string; post_count: number }
type GroupInvite = { id: string; group_id: string; inviter_id: string; status: string; group: Group }

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [pendingInvites, setPendingInvites] = useState<GroupInvite[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState<string>('')

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'member' | 'owner'>('member')

  const [posts, setPosts] = useState<GroupPost[]>([])
  const [newPost, setNewPost] = useState('')
  const [scoreboard, setScoreboard] = useState<ScoreEntry[]>([])

  async function loadGroups() {
    const data = await apiGet<Group[]>('/groups/')
    setGroups(data)
  }

  async function loadInvites() {
    const data = await apiGet<GroupInvite[]>('/groups/invites')
    setPendingInvites(data)
  }

  async function loadPosts(groupId: string) {
    const data = await apiGet<GroupPost[]>(`/groups/${groupId}/posts`)
    setPosts(data)
  }

  async function loadScoreboard(groupId: string) {
    const data = await apiGet<ScoreEntry[]>(`/groups/${groupId}/scoreboard`)
    setScoreboard(data)
  }

  useEffect(() => { loadGroups(); loadInvites() }, [])
  useEffect(() => { if (selected) { loadPosts(selected); loadScoreboard(selected) } }, [selected])

  async function createGroup(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return alert('Group name required')
    await apiPost<Group>('/groups/', { name: name.trim(), description: description.trim() })
    setName(''); setDescription('')
    await loadGroups()
  }

  async function createPost(e: FormEvent) {
    e.preventDefault()
    if (!selected || !newPost.trim()) return
    await apiPost<GroupPost>(`/groups/${selected}/posts`, { content: newPost.trim() })
    setNewPost('')
    await loadPosts(selected); await loadScoreboard(selected)
  }

  async function inviteMember(e: FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    await apiPost(`/groups/${selected}/invite`, { email: inviteEmail.trim(), role: inviteRole })
    setInviteEmail('')
    alert('Invitation sent!')
  }

  async function acceptInvite(inviteId: string) {
    await apiPost(`/groups/invites/${inviteId}/accept`, {})
    await loadGroups(); await loadInvites()
  }

  async function declineInvite(inviteId: string) {
    await apiPost(`/groups/invites/${inviteId}/decline`, {})
    await loadInvites()
  }

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Groups</h1>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <Card>
          <h2 className="font-medium mb-2">Pending Invites</h2>
          <ul className="space-y-2">
            {pendingInvites.map(inv => (
              <li key={inv.id} className="flex justify-between items-center border rounded-lg p-2">
                <div>
                  <div className="font-medium">{inv.group.name}</div>
                  {inv.group.description && <div className="text-sm text-gray-600">{inv.group.description}</div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => acceptInvite(inv.id)} className="btn">Accept</button>
                  <button onClick={() => declineInvite(inv.id)} className="btn btn-outline">Decline</button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Create group form */}
      <Card>
        <form onSubmit={createGroup} className="grid gap-3 md:grid-cols-3">
          <input className="input" placeholder="Group name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <button className="btn">Create group</button>
        </form>
      </Card>

      {selected && (
        <Card>
          <h2 className="font-medium mb-2">Invite a Friend</h2>
          <form onSubmit={inviteMember} className="grid gap-3 md:grid-cols-3">
            <input className="input md:col-span-2" placeholder="User email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            <select className="select" value={inviteRole} onChange={e => setInviteRole(e.target.value as 'member' | 'owner')}>
              <option value="member">Member</option>
              <option value="owner">Owner</option>
            </select>
            <button className="btn md:col-span-3">Send Invite</button>
          </form>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {/* Sidebar with groups */}
        <Card>
          <h2 className="font-medium mb-2">Your Groups</h2>
          <ul className="space-y-2">
            {groups.map(g => (
              <li key={g.id}>
                <button onClick={() => setSelected(g.id)} className={`w-full text-left px-3 py-2 rounded-lg border ${selected === g.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="font-medium">{g.name}</div>
                  {g.description && <div className="text-sm text-gray-600">{g.description}</div>}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Group feed + scoreboard */}
        <div className="md:col-span-2 space-y-4">
          {selected ? (
            <>
              <Card>
                <h2 className="font-medium mb-2">Group Feed</h2>
                <form onSubmit={createPost} className="flex gap-2">
                  <input className="input flex-1" placeholder="Write a post..." value={newPost} onChange={e => setNewPost(e.target.value)} />
                  <button className="btn">Post</button>
                </form>
              </Card>

              <Card>
                <ul className="space-y-3 max-h-80 overflow-auto">
                  {posts.map(p => (
                    <li key={p.id} className="border-b pb-2">
                      <div className="text-sm text-gray-600">{new Date(p.created_at).toLocaleString()}</div>
                      <div>{p.content}</div>
                    </li>
                  ))}
                  {!posts.length && <div className="text-sm text-gray-500">No posts yet.</div>}
                </ul>
              </Card>

              <Card>
                <h2 className="font-medium mb-2">Comments Leaderboard</h2>
                <table className="table">
                  <thead>
                    <tr className="border-b">
                      <th>User</th>
                      <th>Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreboard.map((s, idx) => (
                      <tr key={s.user_id} className="table-row">
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-gray-700 text-xs">{idx+1}</span>
                            <span>{s.username || s.user_id.slice(0, 6)}</span>
                          </div>
                        </td>
                        <td>{s.post_count}</td>
                      </tr>
                    ))}
                    {!scoreboard.length && (
                      <tr>
                        <td className="py-2 px-2 text-gray-500" colSpan={2}>No activity yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </>
          ) : (
            <div className="text-gray-500">Select a group to view feed & leaderboard.</div>
          )}
        </div>
      </div>
    </div>
  )
}
