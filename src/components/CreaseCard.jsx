import { ArrowLeftRight } from 'lucide-react'

function BatterRow({ batter, onStrike }) {
  if (!batter) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50/60 px-2 py-2 text-xs text-red-700">Choose the next batter</p>
    )
  }

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 ${
        onStrike ? 'bg-red-50 ring-1 ring-red-600 shadow-sm' : 'bg-gray-50'
      }`}
    >
      <span className="min-w-0 truncate text-sm font-bold text-gray-900">
        {batter.name}
        {onStrike && <span className="ml-1 text-red-600">*</span>}
      </span>
      <span className="shrink-0 text-sm font-semibold text-gray-800">
        {batter.runs} <span className="font-medium text-gray-500">({batter.balls})</span>
        <span className="ml-2 hidden text-[11px] font-medium text-gray-500 min-[380px]:inline">
          {batter.fours}x4 {batter.sixes}x6
        </span>
      </span>
    </div>
  )
}

function CreaseCard({ current, preview, busy, onSwap }) {
  const striker = preview ? preview.striker : current.striker
  const nonStriker = preview ? preview.nonStriker : current.nonStriker
  const canSwap = Boolean(striker && nonStriker) && current.status === 'in_progress'

  return (
    <div className="flex items-stretch gap-2 p-2">
      <div className="min-w-0 flex-1 space-y-1">
        <BatterRow batter={striker} onStrike />
        <BatterRow batter={nonStriker} onStrike={false} />
      </div>
      <button
        type="button"
        onClick={onSwap}
        disabled={!canSwap || busy}
        aria-label="Swap batters"
        className="flex w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-gray-300 bg-white text-[10px] font-semibold text-gray-800 shadow-sm transition hover:border-red-600 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeftRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        Swap
      </button>
    </div>
  )
}

export default CreaseCard
