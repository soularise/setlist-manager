import { useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable, useDndContext } from '@dnd-kit/core'
import type { Setlist, SetlistSongWithSong, Song } from '@/types'
import { bpmRange, formatDuration } from '@/lib/utils'
import Button from '@/components/ui/Button'
import DraggableRow from './DraggableRow'

interface Props {
  setlist: Setlist | null
  songs: SetlistSongWithSong[]
  allSongs: Song[]
  loading: boolean
  error: string | null
  addSong: (songId: string) => Promise<SetlistSongWithSong>
  removeSong: (id: string) => Promise<void>
}

export default function SetlistEditor({
  setlist,
  songs,
  allSongs,
  loading,
  error,
  addSong,
  removeSong,
}: Props) {
  const [adding, setAdding] = useState(false)
  const [selectedSongId, setSelectedSongId] = useState('')
  const [addError, setAddError] = useState<string | null>(null)

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: 'setlist-container' })
  const { active } = useDndContext()
  const showDropHint = isOver && active?.id.toString().startsWith('lib-')

  const handleAddSong = async () => {
    if (!selectedSongId) return
    setAddError(null)
    try {
      await addSong(selectedSongId)
      setSelectedSongId('')
      setAdding(false)
    } catch (e) {
      setAddError(e instanceof Error ? e.message : 'Failed to add song')
    }
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
        <div className="flex items-center gap-2 print:hidden">
          {!adding && (
            <Button onClick={() => setAdding(true)} disabled={availableSongs.length === 0}>
              + Add song
            </Button>
          )}
          <Button variant="ghost" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </div>

      {adding && (
        <div className="print:hidden">
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
            <Button variant="ghost" onClick={() => { setAdding(false); setAddError(null) }}>Cancel</Button>
          </div>
          {addError && <p className="mt-1 text-sm text-red-500">{addError}</p>}
        </div>
      )}

      <div ref={setDropRef}>
        {songs.length === 0 ? (
          <div
            className={`flex items-center justify-center rounded-lg border-2 border-dashed py-16 text-center transition-colors ${
              showDropHint
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                : 'border-[var(--color-border)]'
            }`}
          >
            <p className="text-sm text-[var(--color-text-secondary)]">
              {showDropHint
                ? 'Release to add song'
                : 'No songs yet — drag from library or use + Add song'}
            </p>
          </div>
        ) : (
          <SortableContext items={songs.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div
              className={`setlist-songs-list flex flex-col gap-2 rounded-lg transition-colors ${
                showDropHint ? 'outline outline-2 outline-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 p-2' : ''
              }`}
            >
              {songs.map((item) => (
                <DraggableRow key={item.id} item={item} onRemove={removeSong} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      {songs.length > 0 && (
        <div className="sticky bottom-0 flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] print:static">
          <span>{songs.length} song{songs.length !== 1 ? 's' : ''}</span>
          {totalDuration > 0 && <span>{formatDuration(totalDuration)} total</span>}
          {bpmRange(bpms) && <span>{bpmRange(bpms)}</span>}
        </div>
      )}
    </div>
  )
}
