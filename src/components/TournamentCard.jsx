import { Calendar, MapPin, Ticket, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRupees } from '../lib/formatCurrency'
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
          <dd className="flex min-w-0 items-center gap-2">
            <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-red-600" />
            <span className="truncate">{tournament.location}</span>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Dates</dt>
          <dd className="flex items-center gap-2">
            <Calendar aria-hidden="true" className="h-4 w-4 shrink-0 text-red-600" />
            {formatDateRange(tournament.startDate, tournament.endDate)}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Registration fee</dt>
          <dd className="flex items-center gap-2">
            <Ticket aria-hidden="true" className="h-4 w-4 shrink-0 text-red-600" />
            Entry Fee: {tournament.registrationFee === 0 ? 'Free' : formatRupees(tournament.registrationFee)}
          </dd>
        </div>
        {tournament.prizeMoney > 0 && (
          <div className="flex gap-2">
            <dt className="sr-only">Prize money</dt>
            <dd className="flex items-center gap-2">
              <Trophy aria-hidden="true" className="h-4 w-4 shrink-0 text-red-600" />
              Prize Money: {formatRupees(tournament.prizeMoney)}
            </dd>
          </div>
        )}
      </dl>
    </Link>
  )
}

export default TournamentCard
