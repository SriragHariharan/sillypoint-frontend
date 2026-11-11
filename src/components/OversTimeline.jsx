import BallChips from './BallChips'

function OversTimeline({ overs }) {
  if (overs.length === 0) return <p className="text-sm text-gray-500">No overs bowled yet.</p>

  return (
    <ul className="space-y-4">
      {overs.map((over) => (
        <li key={over.over} className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-gray-900">
              Over {over.over} <span className="font-medium text-gray-500">· {over.bowler}</span>
            </span>
            <span className="shrink-0 font-semibold text-gray-700">
              {over.runs} runs{over.wickets > 0 && `, ${over.wickets} wkt`}
            </span>
          </div>
          <BallChips balls={over.balls} />
        </li>
      ))}
    </ul>
  )
}

export default OversTimeline
