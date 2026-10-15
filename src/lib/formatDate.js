const parse = (iso) => new Date(`${iso}T00:00:00`)

const short = { day: 'numeric', month: 'short' }
const full = { day: 'numeric', month: 'short', year: 'numeric' }

export const formatDate = (iso) => parse(iso).toLocaleDateString('en-IN', full)

export const formatMatchDateTime = (isoTimestamp) => {
  const when = new Date(isoTimestamp)
  const date = when.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  const time = when.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${date} · ${time}`
}

export const formatDateRange = (start, end) => {
  const from = parse(start)
  const to = parse(end)
  const sameYear = from.getFullYear() === to.getFullYear()
  return `${from.toLocaleDateString('en-IN', sameYear ? short : full)} – ${to.toLocaleDateString('en-IN', full)}`
}
