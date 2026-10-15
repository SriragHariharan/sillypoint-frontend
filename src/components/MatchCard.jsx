import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMatchDateTime } from '../lib/formatDate'
import { matchStageLabel } from '../lib/matchStages'
import Avatar from './Avatar'

function TeamSide({ team }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <Avatar src={team.logo} name={team.name} size="sm" rounded="rounded-xl" />
      <span className="w-full truncate text-sm font-semibold text-gray-900">{team.name}</span>
    </div>
  )
}

function MatchCard({ match }) {
  const stage = matchStageLabel(match.stage)

  return (
    <li className="rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-red-600">
      <Link to={`/matches/${match.id}`} className="block rounded-2xl p-4">
      {stage && (
        <p className="mb-3 flex justify-center">
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">{stage}</span>
        </p>
      )}
      <div className="flex items-center gap-3">
        <TeamSide team={match.teamA} />
        <span className="shrink-0 rounded-full bg-red-600 px-2.5 py-1 text-xs font-extrabold tracking-wider text-white">
          VS
        </span>
        <TeamSide team={match.teamB} />
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600">
        <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
        {formatMatchDateTime(match.scheduledAt)}
      </p>
      {match.notes && <p className="mt-2 line-clamp-2 whitespace-pre-line text-center text-xs text-gray-600">{match.notes}</p>}
      </Link>
    </li>
  )
}

export default MatchCard
