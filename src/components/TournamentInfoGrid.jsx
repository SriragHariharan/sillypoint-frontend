import { CalendarClock, Ticket, Trophy, UserPlus, Users } from 'lucide-react'
import { formatRupees } from '../lib/formatCurrency'
import { formatDate } from '../lib/formatDate'
import { statTileClass } from '../lib/premiumStyles'

function InfoTile({ label, value, icon: Icon, closed = false, className = '' }) {
  return (
    <div className={`${statTileClass} ${className}`}>
      <span className="absolute right-3 top-3.5 flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <div className="flex flex-col-reverse pr-11">
        <dt className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
        <dd className="break-words text-lg font-black leading-tight text-gray-900 sm:text-xl">
          {value}
          {closed && (
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 align-middle text-[11px] font-bold uppercase tracking-wide text-gray-600">
              Closed
            </span>
          )}
        </dd>
      </div>
    </div>
  )
}

function TournamentInfoGrid({ tournament }) {
  const stats = [
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
    <dl className="grid grid-cols-2 gap-3 sm:gap-4 [&>*:last-child:nth-child(even)]:col-span-2">
      <InfoTile
        label="Last date to register"
        value={formatDate(tournament.lastRegistrationDate)}
        icon={CalendarClock}
        closed={tournament.registrationClosed}
        className="col-span-2"
      />
      {stats.map((stat) => (
        <InfoTile key={stat.label} {...stat} />
      ))}
    </dl>
  )
}

export default TournamentInfoGrid
