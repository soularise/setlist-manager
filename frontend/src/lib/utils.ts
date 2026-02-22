export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function bpmRange(bpms: number[]): string | null {
  const valid = bpms.filter((b) => b != null && !isNaN(b))
  if (valid.length === 0) return null
  const min = Math.min(...valid)
  const max = Math.max(...valid)
  return min === max ? `${min} BPM` : `${min}–${max} BPM`
}

export function initials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
