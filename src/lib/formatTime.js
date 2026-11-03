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
