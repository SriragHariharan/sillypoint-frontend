export const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'teams', label: 'Teams' },
  { value: 'matches', label: 'Matches' },
  { value: 'points', label: 'Points' },
]

export const resolveTab = (value) => (TABS.some((item) => item.value === value) ? value : 'overview')
