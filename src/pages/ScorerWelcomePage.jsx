import { Calendar } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import MatchTeamSide from '../components/MatchTeamSide'
import RingsBackdrop from '../components/RingsBackdrop'
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 px-4 py-5 text-center text-white shadow-lg shadow-red-600/25 ring-1 ring-white/15">
        <RingsBackdrop className="h-[26rem] w-[26rem]" />
        <div className="relative">
          <div className="flex items-start gap-3">
            <MatchTeamSide team={match.teamA} onDark />
            <span className="mt-6 shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black tracking-wider text-red-700">
              VS
            </span>
            <MatchTeamSide team={match.teamB} onDark />
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-white">
            <Calendar className="h-4 w-4 shrink-0 text-red-100" aria-hidden="true" />
            {formatMatchDateTime(match.scheduledAt)}
          </p>
          <p className="mt-1 text-xs text-red-100">{match.tournament.name}</p>
        </div>
      </div>

      <ScorerMatchActions match={match} />

      <button type="button" onClick={logOut} className={`mt-5 w-full ${secondaryButtonClass}`}>
        Log out
      </button>
    </AuthLayout>
  )
}

export default ScorerWelcomePage
