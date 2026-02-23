export interface Song {
  id: string
  title: string
  artist?: string
  bpm?: number
  duration_seconds?: number
  created_at: string
}

export interface Setlist {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface SetlistSong {
  id: string
  setlist_id: string
  song_id: string | null  // null for break rows
  position: number
  notes?: string
  break_label?: string
}

export interface SetlistSongWithSong extends SetlistSong {
  song: Song | null  // null for break rows
}

export interface Profile {
  id: string
  display_name?: string
  bio?: string
  avatar_url?: string
  updated_at?: string
}

// Request shapes
export interface SongCreate {
  title: string
  artist?: string
  bpm?: number
  duration_seconds?: number
}

export interface SetlistCreate {
  name: string
  description?: string
}

export interface SetlistSongAdd {
  song_id: string
  position: number
  notes?: string
}

export interface ReorderItem {
  id: string
  position: number
}

export interface ProfileUpdate {
  display_name?: string
  bio?: string
  avatar_url?: string
}
