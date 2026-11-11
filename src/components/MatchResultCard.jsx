import { CheckCircle2, Trophy } from 'lucide-react'
import { useState } from 'react'
import { isConcluded } from '../lib/matchResult'
import { primaryButtonClass, secondaryButtonClass } from '../lib/premiumStyles'
import { teamById } from '../lib/scoringTeams'
import ConfirmModal from './ConfirmModal'

function MatchResultCard({ data, busy, onUndo, onConclude, onBack }) {
  const { match, innings } = data
  const concluded = isConcluded(match)
  const [confirming, setConfirming] = useState(false)

  const conclude = async () => {
    await onConclude()
    setConfirming(false)
  }

  return (
    <section className="mx-auto my-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-[inset_0_3px_0_0_#a6192e]">
      <Trophy className="mx-auto h-8 w-8 text-red-600" aria-hidden="true" />
      <h2 className="mt-2 text-xl font-black tracking-tight text-gray-900">{match.resultSummary ?? 'Match over'}</h2>
      {concluded && (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Match concluded
        </p>
      )}
      <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
        {innings.map((entry) => (
          <li key={entry.number}>
            <span className="font-bold text-gray-900">{teamById(match, entry.battingTeamId).name}</span> {entry.runs}/{entry.wickets} (
            {entry.overs} ov)
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-2">
        {!concluded && (
          <>
            <button type="button" onClick={() => setConfirming(true)} disabled={busy} className={`px-5 ${primaryButtonClass}`}>
              Conclude match
            </button>
            <button type="button" onClick={onUndo} disabled={busy} className={`px-5 ${secondaryButtonClass}`}>
              Undo last ball
            </button>
          </>
        )}
        <button type="button" onClick={onBack} className={`px-5 ${concluded ? primaryButtonClass : secondaryButtonClass}`}>
          Back to match
        </button>
      </div>

      {confirming && (
        <ConfirmModal
          title="Conclude this match?"
          message="The result becomes final and the last ball can no longer be undone. You won't be able to score this match again."
          confirmLabel="Conclude match"
          busy={busy}
          onClose={() => setConfirming(false)}
          onConfirm={conclude}
        />
      )}
    </section>
  )
}

export default MatchResultCard
