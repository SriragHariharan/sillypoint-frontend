const parse = (iso) => new Date(`${iso}T00:00:00`)

const short = { day: 'numeric', month: 'short' }
const full = { day: 'numeric', month: 'short', year: 'numeric' }

export const formatDate = (iso) => parse(iso).toLocaleDateString('en-IN', full)

export const formatDateRange = (start, end) => {
  const from = parse(start)
  const to = parse(end)
  const sameYear = from.getFullYear() === to.getFullYear()
  return `${from.toLocaleDateString('en-IN', sameYear ? short : full)} – ${to.toLocaleDateString('en-IN', full)}`
}
