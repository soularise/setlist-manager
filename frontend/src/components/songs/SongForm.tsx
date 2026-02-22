import { useState } from 'react'
import type { Song, SongCreate } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props {
  initial?: Song
  onSubmit: (data: SongCreate) => Promise<unknown>
  onCancel: () => void
}

export default function SongForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [artist, setArtist] = useState(initial?.artist ?? '')
  const [bpm, setBpm] = useState(initial?.bpm?.toString() ?? '')
  const [duration, setDuration] = useState(initial?.duration_seconds?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return setError('Title is required')
    setSaving(true)
    try {
      await onSubmit({
        title: title.trim(),
        artist: artist.trim() || undefined,
        bpm: bpm ? parseInt(bpm) : undefined,
        duration_seconds: duration ? parseInt(duration) : undefined,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required error={error ?? undefined} />
      <Input label="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="BPM" type="number" min={1} max={300} value={bpm} onChange={(e) => setBpm(e.target.value)} />
        <Input label="Duration (seconds)" type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : initial ? 'Save changes' : 'Add song'}</Button>
      </div>
    </form>
  )
}
