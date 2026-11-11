import { cardClass, infoNoteClass } from '../lib/premiumStyles'
import ScorecardPanel from './ScorecardPanel'

function MatchScorecardSection({ match }) {
  if (!match.scoringStartedAt) return null

  return (
    <section className={`${cardClass} mt-4 p-4 sm:p-6`}>
      {match.resultSummary && (
        <p className={`${infoNoteClass} mb-5 text-center text-sm font-black text-red-700`}>{match.resultSummary}</p>
      )}
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-red-700">Scorecard</h2>
      <ScorecardPanel matchId={match.id} refreshKey={0} />
    </section>
  )
}

export default MatchScorecardSection
