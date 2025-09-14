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
    else {
      alert('Please check your email to verify your account')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-50 via-white to-white">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-brand-600 text-white grid place-items-center text-xl font-semibold shadow-sm">SH</div>
          <h1 className="text-2xl font-semibold mt-3" style={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}>Welcome to StudyHub</h1>
          <p className="text-sm text-gray-600">Sign in to continue your learning</p>
        </div>
        <Card>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button className="btn w-full" disabled={loading}>{loading ? 'Loading…' : 'Sign in'}</button>
          </form>
          <div className="mt-3 text-sm text-gray-600">No account? <button className="text-brand-700 hover:underline" onClick={onSignUp}>Sign up</button></div>
        </Card>
      </div>
    </div>
  )
}