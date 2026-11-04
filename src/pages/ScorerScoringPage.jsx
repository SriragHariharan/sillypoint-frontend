import { Link, Navigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FullPageLoader from '../components/FullPageLoader'
import RetryPanel from '../components/RetryPanel'
import { useSquads } from '../hooks/useSquads'
import { isScoringOpen } from '../lib/scoringWindow'
import { isMatchReady } from '../lib/squad'
import { useScorerStore } from '../store/scorerStore'

function ScorerScoringPage() {
  const { token } = useParams()
  const match = useScorerStore((state) => state.match)
  const scoringOpensAt = useScorerStore((state) => state.scoringOpensAt)
  const serverOffsetMs = useScorerStore((state) => state.serverOffsetMs)
  const { squads, loading, failed, retry } = useSquads()

  const backTo = `/scorer/${token}/welcome`

  if (!match || !isScoringOpen(scoringOpensAt, serverOffsetMs)) return <Navigate to={backTo} replace />
  if (loading) return <FullPageLoader />
  if (failed || !squads) {
    return (
      <AuthLayout title="Start scoring">
        <RetryPanel message="Couldn't load the players." onRetry={retry} />
      </AuthLayout>
    )
  }
  if (!isMatchReady(match, squads)) return <Navigate to={backTo} replace />

  return (
    <AuthLayout title="Start scoring" subtitle={`${match.teamA.name} vs ${match.teamB.name}`}>
      <p className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm font-semibold text-gray-700">
        Scoring feat coming soon....
      </p>
      <Link
        to={backTo}
        className="mt-5 block w-full rounded-full border border-gray-300 py-3 text-center text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
      >
        Back
      </Link>
    </AuthLayout>
  )
}

export default ScorerScoringPage
