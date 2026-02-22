import type { Song } from '@/types'
import { formatDuration } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Props {
  song: Song
  onEdit: (song: Song) => void
  onDelete: (id: string) => void
}

export default function SongCard({ song, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{song.title}</p>
        {song.artist && (
          <p className="truncate text-sm text-[var(--color-text-secondary)]">{song.artist}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {song.bpm && <Badge>{song.bpm} BPM</Badge>}
        {song.duration_seconds != null && (
          <Badge>{formatDuration(song.duration_seconds)}</Badge>
        )}
        <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onEdit(song)}>
          Edit
        </Button>
        <Button
          variant="danger"
          className="px-2 py-1 text-xs"
          onClick={() => onDelete(song.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
