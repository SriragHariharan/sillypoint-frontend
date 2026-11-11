import Avatar from './Avatar'

const joinWithDots = (parts) => parts.filter(Boolean).join('  ·  ')

// The innings' score bug: team, the big score, run rate, LIVE / complete, and the chase
function InningsHeaderBand({ innings }) {
  const { battingTeam, total, chase, target } = innings
  const live = innings.status !== 'completed'
  const chaseLine = joinWithDots([
    target !== null && `Target ${target}`,
    chase && `Need ${chase.requiredRuns} from ${chase.ballsRemaining} ${chase.ballsRemaining === 1 ? 'ball' : 'balls'}`,
    chase?.requiredRate != null && `RRR ${chase.requiredRate.toFixed(2)}`,
  ])

  return (
    <div className="rounded-2xl bg-red-700 p-4 text-white shadow-lg shadow-red-700/20 sm:p-5">
      <div className="flex items-center gap-3">
        <Avatar src={battingTeam.logo} name={battingTeam.name} size="sm" rounded="rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-red-100">Batting</p>
          <h3 className="truncate text-base font-black sm:text-lg">{battingTeam.name}</h3>
        </div>
        {live ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-red-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600 motion-reduce:animate-none" />
            Live
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            Innings complete
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="min-w-0">
          <span className="text-5xl font-black leading-none tabular-nums sm:text-6xl">
            {total.runs}/{total.wickets}
          </span>
          <span className="ml-2 text-sm font-semibold text-red-100">({total.overs} ov)</span>
        </p>
        <div className="shrink-0 text-right">
          <p className="text-[11px] font-bold uppercase tracking-widest text-red-100">Run rate</p>
          <p className="text-2xl font-black tabular-nums">{total.runRate.toFixed(2)}</p>
        </div>
      </div>

      {chaseLine && (
        <p className="mt-4 border-t border-white/20 pt-3 text-sm font-semibold text-white">{chaseLine}</p>
      )}
    </div>
  )
}

export default InningsHeaderBand
