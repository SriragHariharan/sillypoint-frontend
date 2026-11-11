const pad = (value) => String(value).padStart(2, '0')

export const formatDuration = (totalSeconds) => {
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const rest = totalSeconds % 3600
  const clock = [hours, Math.floor(rest / 60), rest % 60].map(pad).join(':')
  return days > 0 ? `${days}d ${clock}` : clock
}

export const formatTime =(totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// How long until a match starts, roughly: "2d 4h", "3h 20m", "12m" or "<1m"
export const formatStartsIn = (ms) => {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return '<1m'
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  return `${minutes}m`
}
