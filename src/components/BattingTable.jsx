import { barPercent, topScorer } from '../lib/scorecardStats'
import ScorecardCard from './ScorecardCard'

const headClass = 'px-2 py-2 text-right text-[11px] font-bold uppercase tracking-widest text-gray-500'
const cellClass = 'px-2 py-3 text-right text-sm font-semibold tabular-nums text-gray-700'

function BattingTable({ batting, didNotBat }) {
  const top = topScorer(batting)
  const maxRate = Math.max(...batting.map((line) => line.strikeRate), 0)

  return (
    <ScorecardCard title="Batting">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] text-left">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">Batter</th>
              {['R', 'B', '4s', '6s', 'SR'].map((label) => (
                <th key={label} className={headClass}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {batting.map((line) => {
              const notOut = line.status === 'not_out'
              return (
                <tr key={line.playerId} className={notOut ? 'bg-red-50/60' : ''}>
                  <td className={`border-l-4 px-3 py-3 ${notOut ? 'border-red-600' : 'border-transparent'}`}>
                    <p className="flex items-center gap-2 text-sm font-black text-gray-900">
                      <span className="truncate">{line.name}</span>
                      {notOut && (
                        <span className="shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                          Not out
                        </span>
                      )}
                    </p>
                    {!notOut && <p className="text-xs text-gray-500">{line.howOut}</p>}
                  </td>
                  <td
                    className={`px-2 py-3 text-right text-xl font-black tabular-nums ${
                      line === top && line.runs > 0 ? 'text-red-700' : 'text-gray-900'
                    }`}
                  >
                    {line.runs}
                  </td>
                  <td className={cellClass}>{line.balls}</td>
                  <td className={cellClass}>{line.fours}</td>
                  <td className={cellClass}>{line.sixes}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold tabular-nums text-gray-700">{line.strikeRate.toFixed(1)}</span>
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-gray-100">
                        <span
                          className="block h-full rounded-full bg-red-600 transition-[width] duration-500 motion-reduce:transition-none"
                          style={{ width: `${barPercent(line.strikeRate, maxRate)}%` }}
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
      {didNotBat.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Did not bat</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {didNotBat.map((player) => (
              <span key={player.id} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                {player.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </ScorecardCard>
  )
}

export default BattingTable
