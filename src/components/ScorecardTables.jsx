const headClass = 'px-2 py-2 text-right text-xs font-semibold uppercase tracking-wide text-red-700'
const cellClass = 'px-2 py-2.5 text-right text-sm text-gray-800'

const statusText = (line) => (line.status === 'not_out' ? 'not out' : line.howOut)

export function BattingTable({ batting, didNotBat }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-red-700">Batter</th>
              {['R', 'B', '4s', '6s', 'SR'].map((label) => (
                <th key={label} className={headClass}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {batting.map((line) => (
              <tr key={line.playerId}>
                <td className="px-2 py-2.5">
                  <p className="text-sm font-bold text-gray-900">{line.name}</p>
                  <p className="text-xs text-gray-500">{statusText(line)}</p>
                </td>
                <td className={`${cellClass} font-bold`}>{line.runs}</td>
                <td className={cellClass}>{line.balls}</td>
                <td className={cellClass}>{line.fours}</td>
                <td className={cellClass}>{line.sixes}</td>
                <td className={cellClass}>{line.strikeRate.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {didNotBat.length > 0 && (
        <p className="mt-3 text-xs text-gray-600">
          <span className="font-semibold text-gray-900">Did not bat: </span>
          {didNotBat.map((player) => player.name).join(', ')}
        </p>
      )}
    </div>
  )
}

export function BowlingTable({ bowling }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[440px] text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-red-700">Bowler</th>
            {['O', 'M', 'R', 'W', 'Wd', 'Nb', 'Econ'].map((label) => (
              <th key={label} className={headClass}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bowling.map((line) => (
            <tr key={line.playerId}>
              <td className="px-2 py-2.5 text-sm font-bold text-gray-900">{line.name}</td>
              <td className={cellClass}>{line.overs}</td>
              <td className={cellClass}>{line.maidens}</td>
              <td className={cellClass}>{line.runs}</td>
              <td className={`${cellClass} font-bold`}>{line.wickets}</td>
              <td className={cellClass}>{line.wides}</td>
              <td className={cellClass}>{line.noBalls}</td>
              <td className={cellClass}>{line.economy.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ExtrasAndWickets({ extras, fallOfWickets }) {
  return (
    <div className="space-y-2 text-xs text-gray-600">
      <p>
        <span className="font-semibold text-gray-900">Extras: {extras.total}</span> (b {extras.byes}, lb {extras.legByes}, wd{' '}
        {extras.wides}, nb {extras.noBalls})
      </p>
      {fallOfWickets.length > 0 && (
        <p>
          <span className="font-semibold text-gray-900">Fall of wickets: </span>
          {fallOfWickets.map((fall) => `${fall.wicketNumber}-${fall.runs} (${fall.name}, ${fall.over} ov)`).join(', ')}
        </p>
      )}
    </div>
  )
}
