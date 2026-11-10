import ScorecardPanel from './ScorecardPanel'

function MatchScorecardSection({ match }) {
  if (!match.scoringStartedAt) return null

  return (
    <section className="mt-4 rounded-2xl border border-gray-200 p-4 sm:p-6">
      {match.resultSummary && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-extrabold text-red-700">
          {match.resultSummary}
        </p>
      )}
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Scorecard</h2>
      <ScorecardPanel matchId={match.id} refreshKey={0} />
    </section>
  )
}

export default MatchScorecardSection
