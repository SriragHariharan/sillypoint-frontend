import { Trophy } from 'lucide-react'
import { teamById } from '../lib/scoringTeams'

function MatchResultCard({ data, busy, onUndo, onBack }) {
  const { match, innings } = data

  return (
    <section className="mx-auto my-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
      <Trophy className="mx-auto h-8 w-8 text-red-600" aria-hidden="true" />
      <h2 className="mt-2 text-xl font-extrabold text-gray-900">{match.resultSummary ?? 'Match over'}</h2>
      <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
        {innings.map((entry) => (
          <li key={entry.number}>
            <span className="font-bold text-gray-900">{teamById(match, entry.battingTeamId).name}</span> {entry.runs}/{entry.wickets} (
            {entry.overs} ov)
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={busy}
          className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
        >
          Undo last ball
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Back to match
        </button>
      </div>
    </section>
  )
}

export default MatchResultCard
