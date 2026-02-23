import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, ListMusic, Music } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useSetlists } from '@/hooks/useSetlists'
import { useSongs } from '@/hooks/useSongs'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SetlistForm from '@/components/setlists/SetlistForm'
import type { Setlist } from '@/types'

function StatCard({
  value,
  label,
  icon,
  loading,
  href,
}: {
  value: number
  label: string
  icon: React.ReactNode
  loading: boolean
  href: string
}) {
  return (
    <Link
      to={href}
      className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm dark:shadow-none transition-colors hover:bg-[var(--color-surface-hover)]"
    >
      <div className="gradient-bg mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white">
        {icon}
      </div>
      <div className="text-3xl font-bold">{loading ? '—' : value}</div>
      <div className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{label}</div>
    </Link>
  )
}

function RecentSetlistRow({ setlist }: { setlist: Setlist }) {
  return (
    <Link
      to={`/setlists/${setlist.id}`}
      className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-sm dark:shadow-none transition-colors hover:bg-[var(--color-surface-hover)]"
    >
      <span className="gradient-text font-medium">{setlist.name}</span>
      <ChevronRight size={16} className="shrink-0 text-[var(--color-text-secondary)]" />
    </Link>
  )
}

export default function Home() {
  const { profile } = useProfile()
  const { setlists, loading: setlistsLoading, createSetlist } = useSetlists()
  const { songs, loading: songsLoading } = useSongs()
  const [showCreate, setShowCreate] = useState(false)
  const navigate = useNavigate()

  const recent = setlists.slice(0, 5)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Here's an overview of your music library.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <StatCard
          value={setlists.length}
          label="Setlists"
          icon={<ListMusic size={18} />}
          loading={setlistsLoading}
          href="/setlists"
        />
        <StatCard
          value={songs.length}
          label="Songs"
          icon={<Music size={18} />}
          loading={songsLoading}
          href="/songs"
        />
      </div>

      {/* Quick actions */}
      <div className="mb-8 flex gap-3">
        <Button onClick={() => setShowCreate(true)}>+ New setlist</Button>
        <Button variant="ghost" onClick={() => navigate('/songs')}>
          + Add song
        </Button>
      </div>

      {/* Recent setlists */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent setlists</h2>
          <Link
            to="/setlists"
            className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
          >
            View all →
          </Link>
        </div>

        {setlistsLoading ? (
          <p className="py-6 text-center text-sm text-[var(--color-text-secondary)]">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--color-text-secondary)]">
            No setlists yet.{' '}
            <button
              className="underline hover:text-[var(--color-text)]"
              onClick={() => setShowCreate(true)}
            >
              Create your first one.
            </button>
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map((sl) => (
              <RecentSetlistRow key={sl.id} setlist={sl} />
            ))}
          </div>
        )}
      </section>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New setlist">
        <SetlistForm
          onSubmit={async (data) => {
            const created = await createSetlist(data)
            setShowCreate(false)
            navigate(`/setlists/${created.id}`)
          }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  )
}
