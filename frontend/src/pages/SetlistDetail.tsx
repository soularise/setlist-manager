import { Link, useParams } from 'react-router-dom'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useSongs } from '@/hooks/useSongs'
import { useSetlist } from '@/hooks/useSetlist'
import SetlistEditor from '@/components/setlists/SetlistEditor'
import SongLibraryPanel from '@/components/setlists/SongLibraryPanel'

function SetlistDetailContent({ id }: { id: string }) {
  const { songs: allSongs, loading: songsLoading } = useSongs()
  const { setlist, songs, loading, error, addSong, addBreak, updateBreakLabel, updateSetlistName, removeSong, reorderSongs } = useSetlist(id)

  const sensors = useSensors(useSensor(PointerSensor))
  const songIdsInSet = new Set(songs.map((s) => s.song_id).filter((id): id is string => id !== null))

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const activeIdStr = active.id.toString()

    if (activeIdStr === 'lib-break') {
      if (!over) return
      await addBreak().catch(() => {})
      return
    }

    if (activeIdStr.startsWith('lib-')) {
      if (!over) return
      const songId = activeIdStr.slice(4)
      await addSong(songId).catch(() => {})
      return
    }

    if (!over || active.id === over.id) return
    const oldIndex = songs.findIndex((s) => s.id === active.id)
    const newIndex = songs.findIndex((s) => s.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSongs(arrayMove(songs, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left panel — song library, desktop only */}
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[var(--color-border)] print:hidden">
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <Link
              to="/"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              ← Setlists
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <SongLibraryPanel
              songs={allSongs}
              songIdsInSet={songIdsInSet}
              loading={songsLoading}
            />
          </div>
        </aside>

        {/* Right panel — setlist editor */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Link
            to="/"
            className="md:hidden mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] print:hidden"
          >
            ← Back to setlists
          </Link>
          <div className="mx-auto max-w-2xl">
            <SetlistEditor
              setlist={setlist}
              songs={songs}
              allSongs={allSongs}
              loading={loading}
              error={error}
              addSong={addSong}
              removeSong={removeSong}
              updateBreakLabel={updateBreakLabel}
              onUpdateName={updateSetlistName}
            />
          </div>
        </div>
      </div>
    </DndContext>
  )
}

export default function SetlistDetail() {
  const { id } = useParams<{ id: string }>()
  if (!id) return null
  return <SetlistDetailContent id={id} />
}
