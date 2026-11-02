import { TABS } from '../lib/tournamentTabs'

function TournamentTabs({ tab, onChange, teamCount }) {
  return (
    <div role="tablist" aria-label="Tournament sections" className="mt-6 flex border-b border-gray-200">
      {TABS.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={tab === item.value}
          onClick={() => onChange(item.value)}
          className={`flex-1 border-b-2 px-3 py-3 text-sm font-semibold transition sm:flex-none sm:px-6 ${
            tab === item.value
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          {item.value === 'teams' && teamCount > 0 ? `${item.label} (${teamCount})` : item.label}
        </button>
      ))}
    </div>
  )
}

export default TournamentTabs
