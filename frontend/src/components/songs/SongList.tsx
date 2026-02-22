import { useState } from 'react'
import type { Song, SongCreate } from '@/types'
import Modal from '@/components/ui/Modal'
import SongCard from './SongCard'
import SongForm from './SongForm'

interface Props {
  songs: Song[]
  onUpdate: (id: string, data: Partial<SongCreate>) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}

export default function SongList({ songs, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<Song | null>(null)

  if (songs.length === 0) {
    return (
      <p className="py-12 text-center text-[var(--color-text-secondary)]">
        No songs yet. Add your first song above.
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onEdit={setEditing}
            onDelete={onDelete}
          />
        ))}
      </div>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Edit song">
        {editing && (
          <SongForm
            initial={editing}
            onSubmit={async (data) => {
              await onUpdate(editing.id, data)
              setEditing(null)
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  )
}
