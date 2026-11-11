import { CalendarDays, MapPin, Ticket, Trophy, UserPlus, Users } from 'lucide-react'
import { formatRupees } from '../lib/formatCurrency'
import { formatDateRange } from '../lib/formatDate'
import { cardClass, iconTileClass } from '../lib/premiumStyles'

function TournamentInfoGrid({ tournament }) {
  const info = [
    { label: 'Location', value: tournament.location, icon: MapPin },
    { label: 'Dates', value: formatDateRange(tournament.startDate, tournament.endDate), icon: CalendarDays },
    {
      label: 'Registration fee',
      value: tournament.registrationFee === 0 ? 'Free' : formatRupees(tournament.registrationFee),
      icon: Ticket,
    },
    ...(tournament.prizeMoney > 0
      ? [{ label: 'Prize money', value: formatRupees(tournament.prizeMoney), icon: Trophy }]
      : []),
    { label: 'Players per side', value: String(tournament.playersPerSide), icon: Users },
    {
      label: 'Substitutes per side',
      value: tournament.substitutesPerSide === 0 ? 'None' : String(tournament.substitutesPerSide),
      icon: UserPlus,
    },
  ]

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {info.map(({ label, value, icon: Icon }) => (
        <div key={label} className={`${cardClass} flex items-center gap-3 p-3.5`}>
          <span className={iconTileClass}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
            <dd className="mt-0.5 break-words text-sm font-semibold text-gray-900">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

export default TournamentInfoGrid
