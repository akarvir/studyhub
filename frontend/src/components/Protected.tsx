import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Navigate } from 'react-router-dom'

export default function Protected({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setAuthed(!!data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session)
    })

    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  if (loading) return <div className="min-h-screen grid place-items-center text-gray-600">Loading…</div>
  if (!authed) return <Navigate to="/login" replace />
  return children
}