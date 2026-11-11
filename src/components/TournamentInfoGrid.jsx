import { CalendarClock, Ticket, Trophy, UserPlus, Users } from 'lucide-react'
import { formatRupees } from '../lib/formatCurrency'
import { formatDate } from '../lib/formatDate'
import { cardClass, iconTileClass } from '../lib/premiumStyles'
import Avatar from './Avatar'

function TournamentInfoGrid({ tournament }) {
  const info = [
    {
      label: 'Last date to register',
      value: `${formatDate(tournament.lastRegistrationDate)}${tournament.registrationClosed ? ' (closed)' : ''}`,
      icon: CalendarClock,
    },
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
    {
      label: 'Organizer contact',
      value: (
        <a
          href={`tel:+91${tournament.organizer.mobile}`}
          className="text-red-600 transition hover:text-red-700"
        >
          +91 {tournament.organizer.mobile}
        </a>
      ),
      leading: <Avatar src={tournament.organizer.avatar} size="sm" rounded="rounded-xl" />,
    },
  ]

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {info.map(({ label, value, icon: Icon, leading }) => (
        <div key={label} className={`${cardClass} flex items-center gap-3 p-3.5`}>
          {leading ?? (
            <span className={iconTileClass}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
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
