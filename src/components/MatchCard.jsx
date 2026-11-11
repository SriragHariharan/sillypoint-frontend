import { Calendar, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMatchDateTime } from '../lib/formatDate'
import { isMatchCompleted, winnerOf } from '../lib/matchResult'
import { matchStageLabel } from '../lib/matchStages'
import { cardClass, cardHoverClass } from '../lib/premiumStyles'
import Avatar from './Avatar'

function TeamSide({ team, winner = false }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <span className={`inline-flex rounded-xl ${winner ? 'ring-2 ring-red-600 ring-offset-2' : ''}`}>
        <Avatar src={team.logo} name={team.name} size="md" rounded="rounded-xl" />
      </span>
      <span className={`w-full truncate text-sm font-bold ${winner ? 'text-red-700' : 'text-gray-900'}`}>
        {team.name}
      </span>
    </div>
  )
}

function MatchCard({ match }) {
  const stage = matchStageLabel(match.stage)
  const completed = isMatchCompleted(match)
  const winner = winnerOf(match)

  return (
    <li className={`${cardClass} ${cardHoverClass} overflow-hidden`}>
      <Link to={`/matches/${match.id}`} className="block">
        {stage && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">{stage}</span>
          </div>
        )}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <TeamSide team={match.teamA} winner={winner?.id === match.teamA.id} />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-black tracking-wider text-white shadow-md shadow-red-600/20">
              VS
            </span>
            <TeamSide team={match.teamB} winner={winner?.id === match.teamB.id} />
          </div>
          {match.notes && (
            <p className="mt-3 line-clamp-2 whitespace-pre-line text-center text-xs text-gray-600">{match.notes}</p>
          )}
        </div>
        <div className="border-t border-red-100 bg-red-50/60 px-4 py-2.5 text-center">
          {completed && (
            <p className="flex items-center justify-center gap-1.5 text-sm font-black text-red-700">
              <Trophy className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 break-words">{match.resultSummary || 'Match completed'}</span>
            </p>
          )}
          <p
            className={`flex items-center justify-center gap-1.5 font-semibold ${
              completed ? 'mt-1 text-xs text-gray-500' : 'text-xs text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            {formatMatchDateTime(match.scheduledAt)}
          </p>
        </div>
      </Link>
    </li>
  )
}

export default MatchCard
