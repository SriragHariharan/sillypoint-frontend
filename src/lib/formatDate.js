const parse = (iso) => new Date(`${iso}T00:00:00`)

const short = { day: 'numeric', month: 'short' }
const full = { day: 'numeric', month: 'short', year: 'numeric' }

export const formatDate = (iso) => parse(iso).toLocaleDateString('en-IN', full)

const IST = 'Asia/Kolkata'

export const matchDateInput = (isoTimestamp) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: IST, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(isoTimestamp),
  )

export const matchTimeInput = (isoTimestamp) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: IST, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(
    new Date(isoTimestamp),
  )

export const formatMatchDateTime = (isoTimestamp) => {
  const when = new Date(isoTimestamp)
  const date = when.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: IST })
  const time = when.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: IST })
  return `${date} · ${time}`
}

export const formatDateRange = (start, end) => {
  const from = parse(start)
  const to = parse(end)
  const sameYear = from.getFullYear() === to.getFullYear()
  return `${from.toLocaleDateString('en-IN', sameYear ? short : full)} – ${to.toLocaleDateString('en-IN', full)}`
}
