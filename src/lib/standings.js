// "+0.512", "-1.250", "0.000"; a dash before the team has batted and bowled
export const formatNrr = (value) => {
  if (value === null || value === undefined) return '—'
  if (value === 0) return '0.000'
  return `${value > 0 ? '+' : '-'}${Math.abs(value).toFixed(3)}`
}

// The same badges as the team match history: won solid red, lost gray, tied outlined
export const FORM_STYLES = {
  W: 'bg-red-600 text-white',
  L: 'bg-gray-100 text-gray-600',
  T: 'border border-red-600 text-red-600',
  NR: 'border border-gray-300 text-gray-500',
}

export const FORM_LABELS = { W: 'Won', L: 'Lost', T: 'Tied', NR: 'No result' }
