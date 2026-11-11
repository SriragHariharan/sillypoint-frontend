import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDateRange } from '../lib/formatDate'
import { headingClass } from '../lib/premiumStyles'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'

function TournamentHeader({ tournament }) {
  return (
    <>
      <Link
        to="/tournaments"
        className="-ml-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        All tournaments
      </Link>

      <header className="mt-3 flex items-start gap-4">
        <Avatar src={tournament.logo} name={tournament.name} size="xl" rounded="rounded-2xl" />
        <div className="min-w-0 flex-1">
          <StatusBadge status={tournament.status} />
          <h1 className={`mt-2 text-2xl sm:text-4xl ${headingClass}`}>{tournament.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-gray-600">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
              <span className="break-words">{tournament.location}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
              {formatDateRange(tournament.startDate, tournament.endDate)}
            </span>
          </p>
        </div>
      </header>
    </>
  )
}

export default TournamentHeader
