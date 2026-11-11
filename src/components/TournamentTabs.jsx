import { TABS } from '../lib/tournamentTabs'

function TournamentTabs({ tab, onChange, teamCount }) {
  return (
    <div
      role="tablist"
      aria-label="Tournament sections"
      className="mt-6 flex gap-1 rounded-full border border-gray-200 bg-gray-50 p-1 sm:inline-flex"
    >
      {TABS.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={tab === item.value}
          onClick={() => onChange(item.value)}
          className={`min-h-11 flex-1 rounded-full px-3 text-sm font-semibold transition sm:flex-none sm:px-6 ${
            tab === item.value
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-gray-600 hover:text-red-600'
          }`}
        >
          {item.value === 'teams' && teamCount > 0 ? `${item.label} (${teamCount})` : item.label}
        </button>
      ))}
    </div>
  )
}

export default TournamentTabs
