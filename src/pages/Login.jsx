import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email atau kata sandi salah.'
          : error.message
      )
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 bg-bg">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 16 L10 8 L14 12 L20 5" stroke="#DE9F4E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-ink">MTrack</h1>
          <p className="mt-1.5 text-sm text-muted">Masuk untuk lanjut catat keuanganmu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@email.com"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Kata sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-expense-soft px-3 py-2 text-sm text-expense">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white transition hover:bg-accent-ink disabled:opacity-60"
          >
            {submitting ? 'Memeriksa…' : 'Masuk'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted">
          Belum punya akun? Minta akun dibuatkan lewat pengelola.
        </p>
      </div>
    </div>
  )
}
