import { ballsText } from '../lib/scoringRules'
import { inningsLabel } from '../lib/scoringTeams'
import BallChips from './BallChips'

function ScoreHeader({ current, teamName }) {
  const chasing = current.target !== null && current.status === 'in_progress'

  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-3 py-2.5 shadow-[inset_0_3px_0_0_#a6192e] short:py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-red-700">
            {inningsLabel(current.number)} · {teamName}
          </p>
          <p className="text-4xl font-black leading-none tracking-tight text-gray-900 short:text-3xl">
            {current.runs}/{current.wickets}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {current.isSuperOver && (
            <span className="mb-1 mr-1 inline-block rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
              Super Over
            </span>
          )}
          {current.isFreeHit && (
            <span className="mb-1 inline-block rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
              Free hit
            </span>
          )}
          <p className="text-sm font-bold text-gray-900">
            {current.overs} <span className="font-medium text-gray-500">/ {current.oversLimit} ov</span>
          </p>
          <p className="text-xs text-gray-500">Run rate {current.runRate.toFixed(2)}</p>
        </div>
      </div>

      {chasing && (
        <p className="mt-1.5 truncate rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
          Target {current.target} · Need {current.requiredRuns} off {ballsText(current.ballsRemaining)}
          {current.requiredRate !== null && ` · RRR ${current.requiredRate.toFixed(2)}`}
        </p>
      )}

      <div className="mt-2 short:mt-1.5">
        <BallChips balls={current.thisOver} compact />
      </div>
    </section>
  )
}

export default ScoreHeader
