import { Calendar } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import ScorerWaitingScreen from '../components/ScorerWaitingScreen'
import { formatMatchDateTime } from '../lib/formatDate'
import { isScoringOpen } from '../lib/scoringWindow'
import { useScorerStore } from '../store/scorerStore'

function ScorerWelcomePage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const scorer = useScorerStore((state) => state.scorer)
  const match = useScorerStore((state) => state.match)
  const scoringOpensAt = useScorerStore((state) => state.scoringOpensAt)
  const serverOffsetMs = useScorerStore((state) => state.serverOffsetMs)
  const clearScorerSession = useScorerStore((state) => state.clearScorerSession)

  const logOut = () => {
    clearScorerSession()
    navigate(`/scorer/${token}`, { replace: true })
  }

  if (!scorer || !match) return null

  if (!isScoringOpen(scoringOpensAt, serverOffsetMs)) {
    return <ScorerWaitingScreen onLogOut={logOut} />
  }

  return (
    <AuthLayout
      title={`Welcome, ${scorer.name}`}
      subtitle="You are the scorer for this match. Live scoring is coming soon."
    >
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-sm font-bold text-gray-900">
          {match.teamA.name} <span className="text-red-600">vs</span> {match.teamB.name}
        </p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          {formatMatchDateTime(match.scheduledAt)}
        </p>
        <p className="mt-1 text-xs text-gray-600">{match.tournament.name}</p>
      </div>

      <button
        type="button"
        onClick={logOut}
        className="mt-5 w-full rounded-full border border-gray-300 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
      >
        Log out
      </button>
    </AuthLayout>
  )
}

export default ScorerWelcomePage
