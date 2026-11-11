import { Trophy } from 'lucide-react'

// The state of the match on the red card: the result once it is over, or "Live" with what is happening now
function MatchStatusBand({ live, completed, resultSummary, liveText }) {
  if (completed) {
    return (
      <div className="relative border-t border-white/15 px-4 py-3 text-center sm:px-6">
        <p className="flex items-center justify-center gap-2 text-sm font-black text-white sm:text-base">
          <Trophy className="h-4 w-4 shrink-0 text-red-100" aria-hidden="true" />
          <span className="min-w-0 break-words">{resultSummary || 'Match completed'}</span>
        </p>
      </div>
    )
  }

  if (live) {
    return (
      <div className="relative flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-white/15 px-4 py-3 text-center sm:px-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-red-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600 motion-reduce:animate-none" />
          Live
        </span>
        {liveText && <span className="min-w-0 break-words text-sm font-semibold text-white">{liveText}</span>}
      </div>
    )
  }

  return null
}

export default MatchStatusBand
