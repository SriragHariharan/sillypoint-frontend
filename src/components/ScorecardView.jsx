import { useState } from 'react'
import OversTimeline from './OversTimeline'
import { BattingTable, BowlingTable, ExtrasAndWickets } from './ScorecardTables'

const tabClass = (active) =>
  `flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
    active ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-800 hover:border-red-600 hover:text-red-600'
  }`

function InningsCard({ innings }) {
  const [view, setView] = useState('card')

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-extrabold text-gray-900">{innings.battingTeam.name}</h3>
        <p className="text-base font-extrabold text-gray-900">
          {innings.total.runs}/{innings.total.wickets}{' '}
          <span className="text-sm font-medium text-gray-500">({innings.total.overs} ov)</span>
        </p>
      </div>
      <p className="mt-0.5 text-xs text-gray-500">Run rate {innings.total.runRate.toFixed(2)}</p>

      <div className="mt-4 flex gap-2">
        <button type="button" className={tabClass(view === 'card')} onClick={() => setView('card')}>
          Scorecard
        </button>
        <button type="button" className={tabClass(view === 'overs')} onClick={() => setView('overs')}>
          Over by over
        </button>
      </div>

      <div className="mt-4 space-y-5">
        {view === 'card' ? (
          <>
            <BattingTable batting={innings.batting} didNotBat={innings.didNotBat} />
            <ExtrasAndWickets extras={innings.extras} fallOfWickets={innings.fallOfWickets} />
            <BowlingTable bowling={innings.bowling} />
          </>
        ) : (
          <OversTimeline overs={innings.overs} />
        )}
      </div>
    </div>
  )
}

function ScorecardView({ scorecard }) {
  const [selected, setSelected] = useState(0)
  const { innings } = scorecard

  if (innings.length === 0) return <p className="text-sm text-gray-600">The scorecard appears once scoring starts.</p>

  const shown = innings[Math.min(selected, innings.length - 1)]

  return (
    <div>
      {innings.length > 1 && (
        <div className="mb-5 flex gap-2">
          {innings.map((entry, index) => (
            <button key={entry.number} type="button" className={tabClass(index === selected)} onClick={() => setSelected(index)}>
              {entry.battingTeam.name}
            </button>
          ))}
        </div>
      )}
      <InningsCard key={shown.number} innings={shown} />
    </div>
  )
}

export default ScorecardView
