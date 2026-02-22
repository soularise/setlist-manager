import { useState } from 'react'
import { useSongs } from '@/hooks/useSongs'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SongForm from '@/components/songs/SongForm'
import SongList from '@/components/songs/SongList'

export default function Songs() {
  const { songs, loading, error, createSong, updateSong, deleteSong } = useSongs()
  const [showCreate, setShowCreate] = useState(false)

  if (loading) return <p className="py-12 text-center text-[var(--color-text-secondary)]">Loading…</p>
  if (error) return <p className="py-12 text-center text-red-500">{error}</p>

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your songs</h1>
        <Button onClick={() => setShowCreate(true)}>+ Add song</Button>
      </div>

      <SongList songs={songs} onUpdate={updateSong} onDelete={deleteSong} />

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add song">
        <SongForm
          onSubmit={async (data) => {
            await createSong(data)
            setShowCreate(false)
          }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  )
}
