import { Calendar } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import ScorerMatchActions from '../components/ScorerMatchActions'
import ScorerWaitingScreen from '../components/ScorerWaitingScreen'
import { formatMatchDateTime } from '../lib/formatDate'
import { secondaryButtonClass } from '../lib/premiumStyles'
import { isScoringOpen } from '../lib/scoringWindow'
import { useScorerStore } from '../store/scorerStore'

function ScorerWelcomePage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const match = useScorerStore((state) => state.match)
  const scoringOpensAt = useScorerStore((state) => state.scoringOpensAt)
  const serverOffsetMs = useScorerStore((state) => state.serverOffsetMs)
  const clearScorerSession = useScorerStore((state) => state.clearScorerSession)

  const logOut = () => {
    clearScorerSession()
    navigate(`/scorer/${token}`, { replace: true })
  }

  if (!match) return null

  if (!isScoringOpen(scoringOpensAt, serverOffsetMs)) {
    return <ScorerWaitingScreen onLogOut={logOut} />
  }

  return (
    <AuthLayout
      eyebrow="Scorer"
      title="Welcome, scorer"
      subtitle="You are the scorer for this match. Set up the players, toss and overs, then start scoring."
    >
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center shadow-sm">
        <p className="text-sm font-bold text-gray-900">
          {match.teamA.name}{' '}
          <span className="mx-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black tracking-wider text-white">
            VS
          </span>{' '}
          {match.teamB.name}
        </p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600">
          <Calendar className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          {formatMatchDateTime(match.scheduledAt)}
        </p>
        <p className="mt-1 text-xs text-gray-600">{match.tournament.name}</p>
      </div>

      <ScorerMatchActions match={match} />

      <button type="button" onClick={logOut} className={`mt-5 w-full ${secondaryButtonClass}`}>
        Log out
      </button>
    </AuthLayout>
  )
}

export default ScorerWelcomePage
