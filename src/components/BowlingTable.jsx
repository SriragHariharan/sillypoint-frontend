import { barPercent, bestBowler } from '../lib/scorecardStats'
import ScorecardCard from './ScorecardCard'

const headClass = 'px-2 py-2 text-right text-[11px] font-bold uppercase tracking-widest text-gray-500'
const cellClass = 'px-2 py-3 text-right text-sm font-semibold tabular-nums text-gray-700'

function BowlingTable({ bowling }) {
  const best = bestBowler(bowling)
  const maxEconomy = Math.max(...bowling.map((line) => line.economy), 0)

  return (
    <ScorecardCard title="Bowling">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">Bowler</th>
              {['O', 'M', 'R', 'W', 'Wd', 'Nb', 'Econ'].map((label) => (
                <th key={label} className={headClass}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bowling.map((line) => {
              const highlight = line === best && line.wickets > 0
              return (
                <tr key={line.playerId} className={highlight ? 'bg-red-50/60' : ''}>
                  <td
                    className={`border-l-4 px-3 py-3 text-sm font-black text-gray-900 ${
                      highlight ? 'border-red-600' : 'border-transparent'
                    }`}
                  >
                    {line.name}
                  </td>
                  <td className={cellClass}>{line.overs}</td>
                  <td className={cellClass}>{line.maidens}</td>
                  <td className={cellClass}>{line.runs}</td>
                  <td className="px-2 py-3 text-right">
                    {line.wickets > 0 ? (
                      <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-sm font-black tabular-nums text-white">
                        {line.wickets}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold tabular-nums text-gray-700">0</span>
                    )}
                  </td>
                  <td className={cellClass}>{line.wides}</td>
                  <td className={cellClass}>{line.noBalls}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold tabular-nums text-gray-700">{line.economy.toFixed(2)}</span>
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-gray-100">
                        <span
                          className="block h-full rounded-full bg-red-600 transition-[width] duration-500 motion-reduce:transition-none"
                          style={{ width: `${barPercent(line.economy, maxEconomy)}%` }}
                        />
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </ScorecardCard>
  )
}

export default BowlingTable
