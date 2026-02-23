import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClass: Record<Variant, string> = {
  primary: 'gradient-bg text-white shadow-md hover:opacity-90 hover:shadow-lg',
  ghost: 'bg-transparent border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)]',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
}

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantClass[variant]} ${className}`}
    />
  )
}
