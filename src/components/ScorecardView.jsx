import { useState } from 'react'
import Avatar from './Avatar'
import BattingTable from './BattingTable'
import BowlingTable from './BowlingTable'
import ExtrasRow from './ExtrasRow'
import FallOfWicketsTimeline from './FallOfWicketsTimeline'
import InningsHeaderBand from './InningsHeaderBand'
import OversTimeline from './OversTimeline'
import ScorecardHighlights from './ScorecardHighlights'

const viewTabClass = (active) =>
  `flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
    active
      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
      : 'border border-gray-300 bg-white text-gray-800 hover:border-red-600 hover:text-red-600'
  }`

// A broadcast "score bug" per innings: logo, team and its score
function InningsTab({ entry, active, onSelect }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`flex min-w-0 flex-1 items-center gap-2 rounded-2xl border px-3 py-2 text-left transition ${
        active
          ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-600/20'
          : 'border-gray-200 bg-white text-gray-900 hover:border-red-600'
      }`}
    >
      <Avatar src={entry.battingTeam.logo} name={entry.battingTeam.name} size="xs" rounded="rounded-lg" />
      <span className="min-w-0 flex-1 truncate text-sm font-bold">{entry.battingTeam.name}</span>
      <span className="shrink-0 text-sm font-black tabular-nums">
        {entry.total.runs}/{entry.total.wickets}
      </span>
    </button>
  )
}

function InningsCard({ innings }) {
  const [view, setView] = useState('card')

  return (
    <div className="space-y-4">
      <InningsHeaderBand innings={innings} />
      <ScorecardHighlights innings={innings} />

      <div className="flex gap-2">
        <button type="button" className={viewTabClass(view === 'card')} onClick={() => setView('card')}>
          Scorecard
        </button>
        <button type="button" className={viewTabClass(view === 'overs')} onClick={() => setView('overs')}>
          Over by over
        </button>
      </div>

      {view === 'card' ? (
        <div className="space-y-4">
          <BattingTable batting={innings.batting} didNotBat={innings.didNotBat} />
          <ExtrasRow extras={innings.extras} />
          <BowlingTable bowling={innings.bowling} />
          <FallOfWicketsTimeline fallOfWickets={innings.fallOfWickets} />
        </div>
      ) : (
        <OversTimeline overs={innings.overs} />
      )}
    </div>
  )
}

function ScorecardView({ scorecard }) {
  const [selected, setSelected] = useState(0)
  const { innings } = scorecard

  if (innings.length === 0) return <p className="text-sm text-gray-600">The scorecard appears once scoring starts.</p>

  const index = Math.min(selected, innings.length - 1)
  const shown = innings[index]

  return (
    <div>
      {innings.length > 1 && (
        <div className="mb-4 flex gap-2">
          {innings.map((entry, position) => (
            <InningsTab key={entry.number} entry={entry} active={position === index} onSelect={() => setSelected(position)} />
          ))}
        </div>
      )}
      <InningsCard key={shown.number} innings={shown} />
    </div>
  )
}

export default ScorecardView
