import { useScorecard } from '../hooks/useScorecard'
import ScorecardBody from './ScorecardBody'

// A match's scorecard that loads itself (the scorer's screen); the public match page shares one fetch with its top card
function ScorecardPanel({ matchId, refreshKey }) {
  const { scorecard, loading, failed, retry } = useScorecard(matchId, refreshKey)

  return <ScorecardBody scorecard={scorecard} loading={loading} failed={failed} retry={retry} />
}

export default ScorecardPanel
