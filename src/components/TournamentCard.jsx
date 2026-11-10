import { Calendar, MapPin, Ticket, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRupees } from '../lib/formatCurrency'
import { formatDateRange } from '../lib/formatDate'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'

const lightTheme = {
  card: 'border-gray-200 bg-white shadow-sm hover:border-red-600 hover:shadow-md active:bg-gray-50',
  title: 'text-gray-900',
  details: 'text-gray-600',
  icon: 'text-red-600',
}

const darkTheme = {
  card: 'border-white/10 bg-white/[0.04] backdrop-blur hover:-translate-y-0.5 hover:border-red-500/60 hover:bg-white/[0.07]',
  title: 'text-white',
  details: 'text-gray-300',
  icon: 'text-red-400',
}

function TournamentCard({ tournament, dark = false }) {
  const theme = dark ? darkTheme : lightTheme
  const iconClass = `h-4 w-4 shrink-0 ${theme.icon}`

  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className={`block rounded-2xl border p-4 transition sm:p-5 ${theme.card}`}
    >
      <div className="flex items-start gap-3">
        <Avatar src={tournament.logo} name={tournament.name} rounded="rounded-xl" />
        <div className="min-w-0 flex-1">
          <StatusBadge status={tournament.status} dark={dark} />
          <h3 className={`mt-1.5 text-base font-bold leading-snug ${theme.title}`}>
            {tournament.name}
          </h3>
        </div>
      </div>

      <dl className={`mt-4 space-y-1.5 text-sm ${theme.details}`}>
        <div className="flex gap-2">
          <dt className="sr-only">Location</dt>
          <dd className="flex min-w-0 items-center gap-2">
            <MapPin aria-hidden="true" className={iconClass} />
            <span className="truncate">{tournament.location}</span>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Dates</dt>
          <dd className="flex items-center gap-2">
            <Calendar aria-hidden="true" className={iconClass} />
            {formatDateRange(tournament.startDate, tournament.endDate)}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Registration fee</dt>
          <dd className="flex items-center gap-2">
            <Ticket aria-hidden="true" className={iconClass} />
            Entry Fee: {tournament.registrationFee === 0 ? 'Free' : formatRupees(tournament.registrationFee)}
          </dd>
        </div>
        {tournament.prizeMoney > 0 && (
          <div className="flex gap-2">
            <dt className="sr-only">Prize money</dt>
            <dd className="flex items-center gap-2">
              <Trophy aria-hidden="true" className={iconClass} />
              Prize Money: {formatRupees(tournament.prizeMoney)}
            </dd>
          </div>
        )}
      </dl>
    </Link>
  )
}

export default TournamentCard
