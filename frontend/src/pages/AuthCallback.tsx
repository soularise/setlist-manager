import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const type = params.get('type')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) navigate('/login', { replace: true })
        else if (type === 'recovery') navigate('/reset-password', { replace: true })
        else navigate('/', { replace: true })
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
