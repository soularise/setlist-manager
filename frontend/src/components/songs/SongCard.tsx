import { Pencil, Trash2 } from 'lucide-react'
import type { Song } from '@/types'
import { formatDuration } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface Props {
  song: Song
  onEdit: (song: Song) => void
  onDelete: (id: string) => void
}

export default function SongCard({ song, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-sm dark:shadow-none">
      <div className="min-w-0 flex-1">
        <p className="gradient-text truncate font-medium">{song.title}</p>
        {song.artist && (
          <p className="truncate text-sm text-[var(--color-text-secondary)]">{song.artist}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {song.bpm && <Badge>{song.bpm} BPM</Badge>}
        {song.duration_seconds != null && (
          <Badge>{formatDuration(song.duration_seconds)}</Badge>
        )}
        <button
          className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
          onClick={() => onEdit(song)}
          aria-label={`Edit ${song.title}`}
        >
          <Pencil size={15} />
        </button>
        <button
          className="p-1 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
          onClick={() => onDelete(song.id)}
          aria-label={`Delete ${song.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}
