import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Profile, ProfileUpdate } from '@/types'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getProfile()
      .then(setProfile)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const updateProfile = async (data: ProfileUpdate) => {
    const updated = await api.updateProfile(data)
    setProfile(updated)
    return updated
  }

  return { profile, loading, error, updateProfile }
}
