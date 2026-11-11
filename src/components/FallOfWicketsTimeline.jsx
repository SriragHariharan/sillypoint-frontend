import ScorecardCard from './ScorecardCard'

function FallOfWicketsTimeline({ fallOfWickets }) {
  return (
    <ScorecardCard title="Fall of wickets">
      {fallOfWickets.length === 0 ? (
        <p className="px-4 py-3 text-sm text-gray-500">No wickets yet.</p>
      ) : (
        <div className="overflow-x-auto px-4 py-4">
          <ol className="relative flex min-w-max gap-3 before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:bg-red-200">
            {fallOfWickets.map((fall) => (
              <li
                key={fall.wicketNumber}
                className="relative rounded-xl border border-red-200 bg-white px-3 py-2 text-center shadow-sm"
              >
                <p className="text-sm font-black tabular-nums text-red-700">
                  {fall.wicketNumber}-{fall.runs}
                </p>
                <p className="text-xs font-semibold text-gray-900">{fall.name}</p>
                <p className="text-[11px] font-medium tabular-nums text-gray-500">{fall.over} ov</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </ScorecardCard>
  )
}

export default FallOfWicketsTimeline
