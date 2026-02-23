import { Link } from 'react-router-dom'
import type { Setlist } from '@/types'
import Button from '@/components/ui/Button'

interface Props {
  setlist: Setlist
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export default function SetlistCard({ setlist, onDelete, onDuplicate }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/setlists/${setlist.id}`}
          className="font-semibold hover:text-[var(--color-accent)]"
        >
          {setlist.name}
        </Link>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            className="px-2 py-1 text-xs"
            onClick={() => onDuplicate(setlist.id)}
            title="Duplicate setlist"
          >
            Copy
          </Button>
          <Button
            variant="danger"
            className="px-2 py-1 text-xs"
            onClick={() => onDelete(setlist.id)}
          >
            Delete
          </Button>
        </div>
      </div>
      {setlist.description && (
        <p className="text-sm text-[var(--color-text-secondary)]">{setlist.description}</p>
      )}
    </div>
  )
}
