import { Link } from 'react-router-dom'
import { formatDateRange } from '../lib/formatDate'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'

function TournamentCard({ tournament }) {
  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-red-600 hover:shadow-md active:bg-gray-50 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <Avatar src={tournament.logo} name={tournament.name} rounded="rounded-xl" />
        <div className="min-w-0 flex-1">
          <StatusBadge status={tournament.status} />
          <h3 className="mt-1.5 text-base font-bold leading-snug text-gray-900">
            {tournament.name}
          </h3>
        </div>
      </div>

      <dl className="mt-4 space-y-1.5 text-sm text-gray-600">
        <div className="flex gap-2">
          <dt className="sr-only">Location</dt>
          <dd className="truncate">📍 {tournament.location}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Dates</dt>
          <dd>📅 {formatDateRange(tournament.startDate, tournament.endDate)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
          {tournament.format}
        </span>
        <span className="text-gray-500">{tournament.teamsCount} teams</span>
      </div>
    </Link>
  )
}

export default TournamentCard
