import RetryPanel from './RetryPanel'
import ScorecardView from './ScorecardView'
import Skeleton from './Skeleton'

// The scorecard (or its loading / error state) from the state of useScorecard
function ScorecardBody({ scorecard, loading, failed, retry }) {
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

export default ScorecardBody
