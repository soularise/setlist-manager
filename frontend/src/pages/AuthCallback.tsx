import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        navigate(error ? '/login' : '/', { replace: true })
      })
    } else {
      // Fallback: implicit flow (hash fragment) — supabase-js handles this automatically
      supabase.auth.getSession().then(({ data: { session } }) => {
        navigate(session ? '/' : '/login', { replace: true })
      })
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center text-[var(--color-text-secondary)]">
      Confirming your account…
    </div>
  )
}
