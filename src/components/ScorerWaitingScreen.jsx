import { useEffect } from 'react'
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'
import { formatMatchDateTime } from '../lib/formatDate'
import { formatDuration } from '../lib/formatTime'
import { matchStageLabel } from '../lib/matchStages'
import { useScorerStore } from '../store/scorerStore'
import AuthLayout from './AuthLayout'
import MatchTeamSide from './MatchTeamSide'

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
        <dd className="mt-0.5 break-words text-sm font-semibold text-gray-900">{children}</dd>
      </div>
    </div>
  )
}

function ScorerWaitingScreen({ onLogOut }) {
  const match = useScorerStore((state) => state.match)
  const scoringOpensAt = useScorerStore((state) => state.scoringOpensAt)
  const serverOffsetMs = useScorerStore((state) => state.serverOffsetMs)
  const requestRefresh = useScorerStore((state) => state.requestRefresh)

  const secondsLeft = useCountdown(Date.parse(scoringOpensAt) - serverOffsetMs)

  useEffect(() => {
    if (secondsLeft === 0) requestRefresh()
  }, [secondsLeft, requestRefresh])

  const stage = matchStageLabel(match.stage)

  return (
    <AuthLayout
      title="Scoring isn't open yet"
      subtitle="You can start scoring 30 minutes before the match begins. This page opens up by itself."
    >
      <div className="rounded-xl bg-red-600 px-4 py-4 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-100">Scoring opens in</p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums" role="timer">
          {formatDuration(secondsLeft)}
        </p>
        <p className="mt-1 text-xs text-red-100">at {formatMatchDateTime(scoringOpensAt)}</p>
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <span className="flex min-w-0 items-center gap-2 text-sm font-bold text-gray-900">
            <Trophy className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span className="truncate">{match.tournament.name}</span>
          </span>
          {stage && (
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
              {stage}
            </span>
          )}
        </div>

        <div className="flex items-start gap-3 px-4 py-5">
          <MatchTeamSide team={match.teamA} />
          <span className="mt-6 shrink-0 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold tracking-wider text-white">
            VS
          </span>
          <MatchTeamSide team={match.teamB} />
        </div>

        <dl className="grid gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4">
          <DetailRow icon={Calendar} label="Match start">
            {formatMatchDateTime(match.scheduledAt)}
          </DetailRow>
          <DetailRow icon={MapPin} label="Location">
            {match.tournament.location}
          </DetailRow>
          <DetailRow icon={Clock} label="Scoring opens">
            {formatMatchDateTime(scoringOpensAt)}
          </DetailRow>
        </dl>
      </section>

      <button
        type="button"
        onClick={onLogOut}
        className="mt-5 w-full rounded-full border border-gray-300 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
      >
        Log out
      </button>
    </AuthLayout>
  )
}

export default ScorerWaitingScreen
