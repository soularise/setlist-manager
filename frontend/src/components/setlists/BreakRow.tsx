import { useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { SetlistSongWithSong } from '@/types'
import Button from '@/components/ui/Button'

interface Props {
  item: SetlistSongWithSong
  onRemove: (id: string) => void
  onUpdateLabel: (id: string, label: string) => void
}

export default function BreakRow({ item, onRemove, onUpdateLabel }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(item.break_label ?? 'Break')
  const inputRef = useRef<HTMLInputElement>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const save = () => {
    setEditing(false)
    const trimmed = label.trim() || 'Break'
    setLabel(trimmed)
    onUpdateLabel(item.id, trimmed)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="setlist-song-row flex items-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3 py-2"
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="print:hidden cursor-grab touch-none text-[var(--color-text-secondary)] active:cursor-grabbing"
      >
        ⠿
      </button>

      <div className="flex-1">
        {editing ? (
          <input
            ref={inputRef}
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') { setLabel(item.break_label ?? 'Break'); setEditing(false) }
            }}
            className="w-full rounded border border-[var(--color-accent)] bg-transparent px-2 py-0.5 text-sm font-medium outline-none"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            title="Click to edit label"
            className="text-sm font-medium italic text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          >
            — {label} —
          </button>
        )}
      </div>

      <Button
        variant="ghost"
        className="print:hidden px-2 py-1 text-xs text-red-500 hover:text-red-600"
        onClick={() => onRemove(item.id)}
        aria-label="Remove break"
      >
        Remove
      </Button>
    </div>
  )
}
