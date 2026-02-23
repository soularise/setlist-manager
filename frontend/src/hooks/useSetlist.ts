import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { ReorderItem, Setlist, SetlistSongWithSong } from '@/types'

export function useSetlist(setlistId: string) {
  const [setlist, setSetlist] = useState<Setlist | null>(null)
  const [songs, setSongs] = useState<SetlistSongWithSong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([api.getSetlist(setlistId), api.getSetlistSongs(setlistId)])
      .then(([sl, slSongs]) => {
        setSetlist(sl)
        setSongs([...slSongs].sort((a, b) => a.position - b.position))
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [setlistId])

  const addSong = async (songId: string) => {
    const entry = await api.addSongToSetlist(setlistId, {
      song_id: songId,
      position: songs.length,
    })
    if (entry.song) {
      // Backend returned the full joined row — use it directly
      setSongs((prev) => [...prev, entry])
    } else {
      // Fallback: refetch to get the joined song data
      const updated = await api.getSetlistSongs(setlistId)
      setSongs([...updated].sort((a, b) => a.position - b.position))
    }
    return entry
  }

  const removeSong = async (setlistSongId: string) => {
    const prev = songs
    const next = songs
      .filter((s) => s.id !== setlistSongId)
      .map((s, i) => ({ ...s, position: i }))
    setSongs(next) // optimistic
    try {
      await api.removeSongFromSetlist(setlistId, setlistSongId)
      if (next.length > 0) {
        await api.reorderSetlistSongs(
          setlistId,
          next.map((s) => ({ id: s.id, position: s.position })),
        )
      }
    } catch (e) {
      setSongs(prev) // rollback
      throw e
    }
  }

  const reorderSongs = async (newOrder: SetlistSongWithSong[]) => {
    const prev = songs
    setSongs(newOrder) // optimistic
    const items: ReorderItem[] = newOrder.map((s, i) => ({ id: s.id, position: i }))
    try {
      await api.reorderSetlistSongs(setlistId, items)
    } catch (e) {
      setSongs(prev) // rollback
      throw e
    }
  }

  const addBreak = async (label: string = 'Break') => {
    const entry = await api.addBreakToSetlist(setlistId, {
      position: songs.length,
      break_label: label,
    })
    setSongs((prev) => [...prev, entry])
    return entry
  }

  const updateBreakLabel = async (setlistSongId: string, label: string) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === setlistSongId ? { ...s, break_label: label } : s)),
    )
    await api.updateBreakLabel(setlistId, setlistSongId, label)
  }

  const updateSetlistName = async (name: string) => {
    const updated = await api.updateSetlist(setlistId, { name })
    setSetlist(updated)
  }

  return { setlist, songs, loading, error, addSong, addBreak, updateBreakLabel, removeSong, reorderSongs, updateSetlistName }
}
