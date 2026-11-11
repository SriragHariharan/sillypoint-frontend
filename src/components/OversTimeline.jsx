import { runningTotals } from '../lib/scorecardStats'
import BallChips from './BallChips'
import RunsPerOverChart from './RunsPerOverChart'

function OversTimeline({ overs }) {
  if (overs.length === 0) return <p className="text-sm text-gray-500">No overs bowled yet.</p>

  const totals = runningTotals(overs)

  return (
    <div className="space-y-4">
      <RunsPerOverChart overs={overs} />
      <ul className="space-y-3">
        {overs
          .map((over, index) => ({ over, total: totals[index] }))
          .reverse()
          .map(({ over, total }) => (
            <li key={over.over} className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-red-600 text-white">
                <span className="text-[9px] font-bold uppercase tracking-widest text-red-100">Over</span>
                <span className="text-lg font-black leading-none tabular-nums">{over.over}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-bold text-gray-900">{over.bowler}</p>
                  <p className="shrink-0 text-sm font-black tabular-nums text-gray-900">
                    {over.runs} runs{over.wickets > 0 && `, ${over.wickets} wkt`}
                  </p>
                </div>
                <div className="mt-2">
                  <BallChips balls={over.balls} />
                </div>
                <p className="mt-2 text-xs font-semibold text-gray-500">
                  Total{' '}
                  <span className="font-black tabular-nums text-gray-900">
                    {total.runs}/{total.wickets}
                  </span>
                </p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default OversTimeline
