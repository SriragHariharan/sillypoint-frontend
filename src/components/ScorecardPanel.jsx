import { useScorecard } from '../hooks/useScorecard'
import RetryPanel from './RetryPanel'
import ScorecardView from './ScorecardView'
import Skeleton from './Skeleton'

function ScorecardPanel({ matchId, refreshKey }) {
  const { scorecard, loading, failed, retry } = useScorecard(matchId, refreshKey)

  if (loading) {
    return (
      <div aria-busy="true">
        <span className="sr-only">Loading the scorecard…</span>
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    )
  }
  if (!scorecard) return <RetryPanel message={failed ? "Couldn't load the scorecard." : 'No scorecard yet.'} onRetry={retry} />

  return <ScorecardView scorecard={scorecard} />
}

export default ScorecardPanel
