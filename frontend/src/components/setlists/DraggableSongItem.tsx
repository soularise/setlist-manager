import { useDraggable } from '@dnd-kit/core'
import type { Song } from '@/types'
import { formatDuration } from '@/lib/utils'

interface Props {
  song: Song
  inSet: boolean
}

export default function DraggableSongItem({ song, inSet }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `lib-${song.id}`,
    disabled: inSet,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!inSet ? { ...attributes, ...listeners } : {})}
      className={[
        'flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm select-none transition-colors',
        inSet
          ? 'opacity-40 cursor-default'
          : 'cursor-grab hover:bg-[var(--color-surface-hover)] active:cursor-grabbing',
        isDragging ? 'opacity-30' : '',
      ].join(' ')}
    >
      <span className="gradient-text truncate font-medium">{song.title}</span>
      {song.artist && (
        <span className="truncate text-xs text-[var(--color-text-secondary)]">{song.artist}</span>
      )}
      {(song.bpm != null || song.duration_seconds != null) && (
        <div className="mt-1 flex gap-2 text-xs text-[var(--color-text-secondary)]">
          {song.bpm != null && <span>{song.bpm} BPM</span>}
          {song.duration_seconds != null && <span>{formatDuration(song.duration_seconds)}</span>}
        </div>
      )}
    </div>
  )
}
