import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { apiGet } from '@/lib/api'

type Profile = { id: string; username: string; avatar_url?: string | null }

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser()
      const e = data.user?.email || ''
      setEmail(e)
      try { setProfile(await apiGet<Profile>('/me')) } catch {}
    })()
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const initials = (profile?.username || email || 'U')[0]?.toUpperCase()

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login' // Protected has authed state that'll change with changes to session, and it'll redirect to login if not authed. Is there need for this? 
    
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v=>!v)} aria-label="User menu"
        className="w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center focus:outline-none">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <span className="font-semibold">{initials}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-md p-2">
          <div className="px-2 py-1.5 text-sm text-gray-700">
            <div className="font-medium">{profile?.username || 'User'}</div>
            <div className="text-gray-500 truncate">{email}</div>
          </div>
          <div className="h-px bg-gray-100 my-2" />
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm" onClick={signOut}>Sign out</button>
        </div>
      )}
    </div>
  )
}
