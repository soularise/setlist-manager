import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Song, SongCreate } from '@/types'

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getSongs()
      .then(setSongs)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const createSong = async (data: SongCreate) => {
    const song = await api.createSong(data)
    setSongs((prev) => [song, ...prev])
    return song
  }

  const updateSong = async (id: string, data: Partial<SongCreate>) => {
    const updated = await api.updateSong(id, data)
    setSongs((prev) => prev.map((s) => (s.id === id ? updated : s)))
    return updated
  }

  const deleteSong = async (id: string) => {
    const prev = songs
    setSongs((s) => s.filter((s) => s.id !== id)) // optimistic
    try {
      await api.deleteSong(id)
    } catch (e) {
      setSongs(prev) // rollback
      throw e
    }
  }

  return { songs, loading, error, createSong, updateSong, deleteSong }
}
