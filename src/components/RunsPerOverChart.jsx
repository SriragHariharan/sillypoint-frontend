import { barPercent } from '../lib/scorecardStats'
import ScorecardCard from './ScorecardCard'

// One bar per over (a Manhattan chart): the runs above the bar, a W marker for overs that took wickets
function RunsPerOverChart({ overs }) {
  const max = Math.max(...overs.map((over) => over.runs), 0)

  return (
    <ScorecardCard title="Runs per over">
      <div className="overflow-x-auto px-4 pb-3 pt-4">
        <div className="flex min-w-max items-end gap-2">
          {overs.map((over) => (
            <div key={over.over} className="flex w-9 flex-col items-center">
              <span className="flex h-5 items-center">
                {over.wickets > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[9px] font-black text-white">
                    {over.wickets > 1 ? `${over.wickets}W` : 'W'}
                  </span>
                )}
              </span>
              <span className="text-xs font-black tabular-nums text-gray-900">{over.runs}</span>
              <div className="mt-1 flex h-24 w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-red-600 transition-[height] duration-500 motion-reduce:transition-none"
                  style={{ height: `${barPercent(over.runs, max)}%` }}
                />
              </div>
              <span className="mt-1 border-t border-gray-200 pt-1 text-[11px] font-bold tabular-nums text-gray-500">
                {over.over}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScorecardCard>
  )
}

export default RunsPerOverChart
