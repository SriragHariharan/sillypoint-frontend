function BowlerCard({ current, busy, onChange }) {
  const { bowler } = current

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2">
      {bowler ? (
        <span className="min-w-0 truncate text-sm">
          <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Bowling</span>
          <span className="font-bold text-gray-900">{bowler.name}</span>
        </span>
      ) : (
        <span className="text-xs text-gray-500">Choose the bowler for the next over</span>
      )}
      <span className="flex shrink-0 items-center gap-2">
        {bowler && (
          <span className="text-sm font-semibold text-gray-800">
            {bowler.overs}-{bowler.maidens}-{bowler.runs}-{bowler.wickets}
          </span>
        )}
        {current.canChangeBowler && (
          <button
            type="button"
            onClick={onChange}
            disabled={busy}
            className="rounded-full border border-gray-300 px-2.5 py-1 text-[11px] font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Change
          </button>
        )}
      </span>
    </div>
  )
}

export default BowlerCard
