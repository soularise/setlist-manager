import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import Avatar from '@/components/profile/Avatar'

export default function Nav() {
  const { signOut } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="relative flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 shadow-sm dark:shadow-none">
      {/* Gradient accent line along the top */}
      <div className="gradient-bg absolute inset-x-0 top-0 h-0.5" />

      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-icon.png" alt="" className="h-8 w-8 rounded-md" />
          <span className="hidden text-lg font-bold tracking-tight text-white sm:inline">Setlist Manager</span>
        </Link>
        <Link
          to="/setlists"
          className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
        >
          Setlists
        </Link>
        <Link
          to="/songs"
          className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
        >
          Songs
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/profile" aria-label="Profile">
          <Avatar name={profile?.display_name} src={profile?.avatar_url} size={32} />
        </Link>
        <button
          onClick={handleSignOut}
          className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
