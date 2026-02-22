import { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Song } from '@/types'
import { useSetlist } from '@/hooks/useSetlist'
import { bpmRange, formatDuration } from '@/lib/utils'
import Button from '@/components/ui/Button'
import DraggableRow from './DraggableRow'

interface Props {
  setlistId: string
  allSongs: Song[]
}

export default function SetlistEditor({ setlistId, allSongs }: Props) {
  const { setlist, songs, loading, error, addSong, removeSong, reorderSongs } =
    useSetlist(setlistId)
  const [adding, setAdding] = useState(false)
  const [selectedSongId, setSelectedSongId] = useState('')

  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = songs.findIndex((s) => s.id === active.id)
    const newIndex = songs.findIndex((s) => s.id === over.id)
    reorderSongs(arrayMove(songs, oldIndex, newIndex))
  }

  const handleAddSong = async () => {
    if (!selectedSongId) return
    await addSong(selectedSongId)
    setSelectedSongId('')
    setAdding(false)
  }

  const totalDuration = songs.reduce((sum, s) => sum + (s.song.duration_seconds ?? 0), 0)
  const bpms = songs.map((s) => s.song.bpm).filter((b): b is number => b != null)
  const songIdsInSet = new Set(songs.map((s) => s.song_id))
  const availableSongs = allSongs.filter((s) => !songIdsInSet.has(s.id))

  if (loading) return <div className="py-12 text-center text-[var(--color-text-secondary)]">Loading…</div>
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{setlist?.name}</h1>
        {!adding && (
          <Button onClick={() => setAdding(true)} disabled={availableSongs.length === 0}>
            + Add song
          </Button>
        )}
      </div>

      {adding && (
        <div className="flex gap-2">
          <select
            value={selectedSongId}
            onChange={(e) => setSelectedSongId(e.target.value)}
            className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          >
            <option value="">Select a song…</option>
            {availableSongs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}{s.artist ? ` — ${s.artist}` : ''}
              </option>
            ))}
          </select>
          <Button onClick={handleAddSong} disabled={!selectedSongId}>Add</Button>
          <Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
        </div>
      )}

      {songs.length === 0 ? (
        <p className="py-12 text-center text-[var(--color-text-secondary)]">
          No songs in this setlist yet.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={songs.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {songs.map((item) => (
                <DraggableRow key={item.id} item={item} onRemove={removeSong} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {songs.length > 0 && (
        <div className="sticky bottom-0 flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)]">
          <span>{songs.length} song{songs.length !== 1 ? 's' : ''}</span>
          {totalDuration > 0 && <span>{formatDuration(totalDuration)} total</span>}
          {bpmRange(bpms) && <span>{bpmRange(bpms)}</span>}
        </div>
      )}
    </div>
  )
}
