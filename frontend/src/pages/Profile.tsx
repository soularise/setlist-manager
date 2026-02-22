import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import Avatar from '@/components/profile/Avatar'
import ProfileForm from '@/components/profile/ProfileForm'

export default function Profile() {
  const { session } = useAuth()
  const { profile, loading, error, updateProfile } = useProfile()

  if (loading) return <p className="py-12 text-center text-[var(--color-text-secondary)]">Loading…</p>
  if (error || !profile) return <p className="py-12 text-center text-red-500">{error ?? 'Profile not found'}</p>

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <Avatar name={profile.display_name} src={profile.avatar_url} size={56} />
        <div>
          <p className="font-semibold">{profile.display_name ?? 'No name set'}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{session?.user.email}</p>
        </div>
      </div>
      <ProfileForm profile={profile} onSave={updateProfile} />
    </div>
  )
}
