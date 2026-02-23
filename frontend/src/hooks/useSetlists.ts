import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Setlist, SetlistCreate } from '@/types'

export function useSetlists() {
  const [setlists, setSetlists] = useState<Setlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getSetlists()
      .then(setSetlists)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const createSetlist = async (data: SetlistCreate) => {
    const setlist = await api.createSetlist(data)
    setSetlists((prev) => [setlist, ...prev])
    return setlist
  }

  const updateSetlist = async (id: string, data: Partial<SetlistCreate>) => {
    const updated = await api.updateSetlist(id, data)
    setSetlists((prev) => prev.map((s) => (s.id === id ? updated : s)))
    return updated
  }

  const deleteSetlist = async (id: string) => {
    const prev = setlists
    setSetlists((s) => s.filter((s) => s.id !== id)) // optimistic
    try {
      await api.deleteSetlist(id)
    } catch (e) {
      setSetlists(prev) // rollback
      throw e
    }
  }

  const duplicateSetlist = async (id: string) => {
    const copy = await api.duplicateSetlist(id)
    setSetlists((prev) => [copy, ...prev])
    return copy
  }

  return { setlists, loading, error, createSetlist, updateSetlist, deleteSetlist, duplicateSetlist }
}
