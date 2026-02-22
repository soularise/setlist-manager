import { Link, useParams } from 'react-router-dom'
import { useSongs } from '@/hooks/useSongs'
import SetlistEditor from '@/components/setlists/SetlistEditor'

export default function SetlistDetail() {
  const { id } = useParams<{ id: string }>()
  const { songs, loading } = useSongs()

  if (!id) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
      >
        ← Back to setlists
      </Link>
      {!loading && <SetlistEditor setlistId={id} allSongs={songs} />}
    </div>
  )
}
