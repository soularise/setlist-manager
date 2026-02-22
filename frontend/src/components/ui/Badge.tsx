interface Props {
  children: React.ReactNode
  className?: string
}

export default function Badge({ children, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-[var(--color-surface-hover)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] ${className}`}
    >
      {children}
    </span>
  )
}
