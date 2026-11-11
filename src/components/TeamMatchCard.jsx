import { Calendar, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMatchDateTime } from '../lib/formatDate'
import { formatStartsIn } from '../lib/formatTime'
import { matchStageLabel } from '../lib/matchStages'
import { cardClass, cardHoverClass } from '../lib/premiumStyles'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'

const RESULTS = {
  won: { label: 'Won', className: 'bg-red-600 text-white' },
  lost: { label: 'Lost', className: 'bg-gray-100 text-gray-600' },
  tied: { label: 'Tied', className: 'border border-red-600 text-red-600' },
}

const scoreText = (score) => (score ? `${score.runs}/${score.wickets} (${score.overs} ov)` : '—')

function Side({ side, own }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
      <Avatar src={side.logo} name={side.name} size="sm" rounded="rounded-xl" />
      <span className={`w-full truncate text-sm ${own ? 'font-black text-red-600' : 'font-semibold text-gray-900'}`}>
        {side.name}
      </span>
      <span className="text-xs font-semibold text-gray-600">{scoreText(side.score)}</span>
    </div>
  )
}

function StateBadge({ match, now }) {
  const result = RESULTS[match.result]
  if (result) {
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${result.className}`}>
        {result.label}
      </span>
    )
  }
  if (match.state === 'completed') return <StatusBadge status="completed" />
  if (match.state === 'upcoming' && new Date(match.scheduledAt).getTime() < now) {
    return (
      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-gray-600">
        Not started
      </span>
    )
  }
  return <StatusBadge status={match.state} />
}

// `countdown` adds "Starts in …" to a match that has not started yet; `highlight` marks the team's next match
function TeamMatchCard({ match, teamId, now, countdown = false, highlight = false }) {
  const stage = matchStageLabel(match.stage)
  const startsInMs = new Date(match.scheduledAt).getTime() - now
  const showCountdown = countdown && match.state === 'upcoming' && startsInMs > 0

  return (
    <li className={`${cardClass} ${cardHoverClass} ${highlight ? 'border-red-200' : ''}`}>
      <Link to={`/matches/${match.id}`} className="block rounded-2xl p-4">
        {highlight && <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-red-600">Next match</p>}
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-xs font-semibold text-gray-500">
            {match.tournament.name}
            {stage && ` · ${stage}`}
          </p>
          <StateBadge match={match} now={now} />
        </div>

        <div className="mt-4 flex items-start gap-3">
          <Side side={match.teamA} own={match.teamA.id === teamId} />
          <span className="mt-2 shrink-0 rounded-full bg-red-600 px-2.5 py-1 text-xs font-black tracking-wider text-white">
            VS
          </span>
          <Side side={match.teamB} own={match.teamB.id === teamId} />
        </div>

        {match.resultSummary && <p className="mt-3 text-center text-sm font-bold text-gray-900">{match.resultSummary}</p>}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-semibold text-gray-600">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            {formatMatchDateTime(match.scheduledAt)}
          </span>
          {showCountdown && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 font-bold text-red-700">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Starts in {formatStartsIn(startsInMs)}
            </span>
          )}
        </div>
      </Link>
    </li>
  )
}

export default TeamMatchCard
