import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Card from '@/components/Card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null); setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    // redirect handled by Protected + router
    window.location.href = '/'
  }

  async function onSignUp() {
    setError(null); setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else alert('Check your email to confirm your account!')
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card>
        <h1 className="text-xl font-semibold mb-4">Welcome to StudyHub</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 w-80">
          <input className="border rounded-lg px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="btn" disabled={loading}>{loading ? 'Loading…' : 'Sign in'}</button>
        </form>
        <div className="mt-3 text-sm text-gray-600">No account? <button className="text-brand-700 hover:underline" onClick={onSignUp}>Sign up</button></div>
      </Card>
    </div>
  )
}