import type { Song } from '@/types'
import DraggableSongItem from './DraggableSongItem'

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
