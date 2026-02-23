import { useDraggable } from '@dnd-kit/core'
import type { Song } from '@/types'
import DraggableSongItem from './DraggableSongItem'

function DraggableBreak() {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'lib-break',
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={[
        'flex items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3 py-2 text-sm select-none cursor-grab active:cursor-grabbing hover:bg-[var(--color-surface)] transition-colors',
        isDragging ? 'opacity-30' : '',
      ].join(' ')}
    >
      <span className="text-[var(--color-text-secondary)]">⠿</span>
      <span className="italic text-[var(--color-text-secondary)]">Break / Divider</span>
    </div>
  )
}

interface Props {
  songs: Song[]
  songIdsInSet: Set<string>
  loading: boolean
}

export default function SongLibraryPanel({ songs, songIdsInSet, loading }: Props) {
  if (loading) {
    return <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Song Library
      </p>
      <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Drag to add to setlist</p>

      <DraggableBreak />

      {songs.length > 0 && (
        <div className="my-1 border-t border-[var(--color-border)]" />
      )}

      {songs.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          No songs yet.{' '}
          <a href="/songs" className="underline hover:text-[var(--color-text)]">
            Add some.
          </a>
        </p>
      ) : (
        songs.map((song) => (
          <DraggableSongItem key={song.id} song={song} inSet={songIdsInSet.has(song.id)} />
        ))
      )}
    </div>
  )
}
