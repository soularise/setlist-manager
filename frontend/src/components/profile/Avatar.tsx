import { initials } from '@/lib/utils'

interface Props {
  name?: string
  src?: string
  size?: number
}

export default function Avatar({ name, src, size = 40 }: Props) {
  const style = { width: size, height: size, fontSize: size * 0.4 }
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        style={style}
        className="rounded-full object-cover"
      />
    )
  }
  return (
    <div
      style={style}
      className="flex items-center justify-center rounded-full bg-[var(--color-accent)] font-semibold text-white"
    >
      {initials(name)}
    </div>
  )
}
