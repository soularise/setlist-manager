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
    <nav className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-4">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-semibold tracking-tight">
          Setlist Manager
        </Link>
        <Link to="/songs" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
          Songs
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/profile" aria-label="Profile">
          <Avatar name={profile?.display_name} src={profile?.avatar_url} size={32} />
        </Link>
        <button
          onClick={handleSignOut}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
