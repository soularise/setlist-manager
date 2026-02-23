import { useState } from 'react'
import type { Profile, ProfileUpdate } from '@/types'
import Avatar from '@/components/profile/Avatar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props {
  profile: Profile
  onSave: (data: ProfileUpdate) => Promise<unknown>
}

export default function ProfileForm({ profile, onSave }: Props) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        display_name: displayName || undefined,
        bio: bio || undefined,
        avatar_url: avatarUrl || undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Display name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Your name"
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="A little about you..."
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Avatar</label>
        <div className="flex items-center gap-3">
          <Avatar name={displayName || profile.display_name} src={avatarUrl || undefined} size={48} />
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">Paste a URL to any image</p>
      </div>
      <Button type="submit" disabled={saving}>
        {saved ? 'Saved!' : saving ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
