import { useScorecard } from '../hooks/useScorecard'
import RetryPanel from './RetryPanel'
import ScorecardView from './ScorecardView'

function ScorecardPanel({ matchId, refreshKey }) {
  const { scorecard, loading, failed, retry } = useScorecard(matchId, refreshKey)

  if (loading) return <p className="py-6 text-center text-sm text-gray-500">Loading the scorecard…</p>
  if (!scorecard) return <RetryPanel message={failed ? "Couldn't load the scorecard." : 'No scorecard yet.'} onRetry={retry} />

  return <ScorecardView scorecard={scorecard} />
}

export default ScorecardPanel
