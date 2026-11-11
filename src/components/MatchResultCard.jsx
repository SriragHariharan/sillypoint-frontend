import { CheckCircle2, Trophy } from 'lucide-react'
import { primaryButtonClass } from '../lib/premiumStyles'
import { teamById } from '../lib/scoringTeams'

function MatchResultCard({ data, onBack }) {
  const { match, innings } = data

  return (
    <section className="mx-auto my-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-[inset_0_3px_0_0_#a6192e]">
      <Trophy className="mx-auto h-8 w-8 text-red-600" aria-hidden="true" />
      <h2 className="mt-2 text-xl font-black tracking-tight text-gray-900">{match.resultSummary ?? 'Match over'}</h2>
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        Match completed
      </p>
      <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
        {innings.map((entry) => (
          <li key={entry.number}>
            <span className="font-bold text-gray-900">{teamById(match, entry.battingTeamId).name}</span> {entry.runs}/{entry.wickets} (
            {entry.overs} ov)
          </li>
        ))}
      </ul>
      <button type="button" onClick={onBack} className={`mt-5 w-full px-5 ${primaryButtonClass}`}>
        Back to match
      </button>
    </section>
  )
}

export default MatchResultCard
