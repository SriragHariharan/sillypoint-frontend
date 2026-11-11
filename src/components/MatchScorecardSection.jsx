import ScorecardBody from './ScorecardBody'

// Only the scorecards: the score, status and result are on the match's top card
function MatchScorecardSection({ match, state }) {
  if (!match.scoringStartedAt) return null

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-700">Scorecard</h2>
      <ScorecardBody {...state} />
    </section>
  )
}

export default MatchScorecardSection
