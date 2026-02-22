import type {
  Profile,
  ProfileUpdate,
  ReorderItem,
  Setlist,
  SetlistCreate,
  SetlistSongAdd,
  SetlistSongWithSong,
  Song,
  SongCreate,
} from '@/types'
import { supabase } from './supabaseClient'

async function authHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers = await authHeaders()
  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  // Profile
  getProfile: () => request<Profile>('GET', '/api/profile'),
  updateProfile: (data: ProfileUpdate) => request<Profile>('PUT', '/api/profile', data),

  // Songs
  getSongs: () => request<Song[]>('GET', '/api/songs'),
  createSong: (data: SongCreate) => request<Song>('POST', '/api/songs', data),
  updateSong: (id: string, data: Partial<SongCreate>) => request<Song>('PUT', `/api/songs/${id}`, data),
  deleteSong: (id: string) => request<void>('DELETE', `/api/songs/${id}`),

  // Setlists
  getSetlists: () => request<Setlist[]>('GET', '/api/setlists'),
  getSetlist: (id: string) => request<Setlist>('GET', `/api/setlists/${id}`),
  createSetlist: (data: SetlistCreate) => request<Setlist>('POST', '/api/setlists', data),
  updateSetlist: (id: string, data: Partial<SetlistCreate>) =>
    request<Setlist>('PUT', `/api/setlists/${id}`, data),
  deleteSetlist: (id: string) => request<void>('DELETE', `/api/setlists/${id}`),

  // Setlist songs
  getSetlistSongs: (setlistId: string) =>
    request<SetlistSongWithSong[]>('GET', `/api/setlists/${setlistId}/songs`),
  addSongToSetlist: (setlistId: string, data: SetlistSongAdd) =>
    request<SetlistSongWithSong>('POST', `/api/setlists/${setlistId}/songs`, data),
  removeSongFromSetlist: (setlistId: string, setlistSongId: string) =>
    request<void>('DELETE', `/api/setlists/${setlistId}/songs/${setlistSongId}`),
  reorderSetlistSongs: (setlistId: string, items: ReorderItem[]) =>
    request<void>('PUT', `/api/setlists/${setlistId}/songs/reorder`, { items }),
}
