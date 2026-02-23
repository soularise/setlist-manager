import { Copy, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Setlist } from '@/types'

interface Props {
  setlist: Setlist
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export default function SetlistCard({ setlist, onDelete, onDuplicate }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-md dark:shadow-none transition-shadow hover:shadow-lg dark:hover:shadow-none">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/setlists/${setlist.id}`}
          className="gradient-text font-semibold hover:opacity-80"
        >
          {setlist.name}
        </Link>
        <div className="flex shrink-0 gap-1">
          <button
            className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
            onClick={() => onDuplicate(setlist.id)}
            aria-label="Duplicate setlist"
            title="Duplicate setlist"
          >
            <Copy size={15} />
          </button>
          <button
            className="p-1 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
            onClick={() => onDelete(setlist.id)}
            aria-label="Delete setlist"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      {setlist.description && (
        <p className="text-sm text-[var(--color-text-secondary)]">{setlist.description}</p>
      )}
    </div>
  )
}
