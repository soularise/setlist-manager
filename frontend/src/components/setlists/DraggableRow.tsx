import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { SetlistSongWithSong } from '@/types'
import { formatDuration } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Props {
  item: SetlistSongWithSong
  onRemove: (setlistSongId: string) => void
}

export default function DraggableRow({ item, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="setlist-song-row flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="print:hidden cursor-grab touch-none text-[var(--color-text-secondary)] active:cursor-grabbing"
      >
        ⠿
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.song.title}</p>
        {item.song.artist && (
          <p className="truncate text-xs text-[var(--color-text-secondary)]">{item.song.artist}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {item.song.bpm && <Badge>{item.song.bpm} BPM</Badge>}
        {item.song.duration_seconds != null && (
          <Badge>{formatDuration(item.song.duration_seconds)}</Badge>
        )}
        <Button
          variant="ghost"
          className="print:hidden px-2 py-1 text-xs text-red-500 hover:text-red-600"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.song.title}`}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}
