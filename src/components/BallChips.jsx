const MAX_COMPACT_CHIPS = 10

const chipClass = (label) => {
  if (label.includes('W')) return 'bg-red-600 text-white'
  if (label === '4' || label === '6') return 'bg-gray-900 text-white'
  if (label.startsWith('Wd') || label.startsWith('Nb')) return 'bg-gray-200 text-gray-900'
  if (label === 'Ret') return 'bg-gray-100 text-gray-600'
  return 'border border-gray-300 bg-white text-gray-800'
}

function BallChips({ balls, title, compact = false }) {
  if (compact) {
    const shown = balls.slice(-MAX_COMPACT_CHIPS)

    return (
      <div className="flex h-7 items-center gap-1 overflow-hidden">
        <span className="shrink-0 pr-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Over</span>
        {balls.length === 0 && <span className="text-xs text-gray-500">No balls yet</span>}
        {shown.length < balls.length && <span className="shrink-0 text-xs text-gray-400">…</span>}
        {shown.map((label, index) => (
          <span
            key={index}
            className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${chipClass(label)}`}
          >
            {label}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div>
      {title && <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h2>}
      <div className="flex flex-wrap gap-1.5">
        {balls.length === 0 && <span className="text-sm text-gray-500">No balls bowled yet</span>}
        {balls.map((label, index) => (
          <span
            key={index}
            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-bold ${chipClass(label)}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default BallChips
