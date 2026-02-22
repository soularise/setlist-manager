import { useState } from 'react'
import { useSetlists } from '@/hooks/useSetlists'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SetlistCard from '@/components/setlists/SetlistCard'
import SetlistForm from '@/components/setlists/SetlistForm'

export default function Dashboard() {
  const { setlists, loading, error, createSetlist, deleteSetlist } = useSetlists()
  const [showCreate, setShowCreate] = useState(false)

  if (loading) return <p className="py-12 text-center text-[var(--color-text-secondary)]">Loading…</p>
  if (error) return <p className="py-12 text-center text-red-500">{error}</p>

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your setlists</h1>
        <Button onClick={() => setShowCreate(true)}>+ New setlist</Button>
      </div>

      {setlists.length === 0 ? (
        <p className="py-12 text-center text-[var(--color-text-secondary)]">
          No setlists yet. Create your first one above.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {setlists.map((sl) => (
            <SetlistCard key={sl.id} setlist={sl} onDelete={deleteSetlist} />
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New setlist">
        <SetlistForm
          onSubmit={async (data) => {
            await createSetlist(data)
            setShowCreate(false)
          }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  )
}
