import { formatRupees } from '../lib/formatCurrency'
import { formatDateRange } from '../lib/formatDate'

function TournamentInfoGrid({ tournament }) {
  const info = [
    { label: 'Location', value: tournament.location },
    { label: 'Dates', value: formatDateRange(tournament.startDate, tournament.endDate) },
    {
      label: 'Registration fee',
      value: tournament.registrationFee === 0 ? 'Free' : formatRupees(tournament.registrationFee),
    },
    ...(tournament.prizeMoney > 0 ? [{ label: 'Prize money', value: formatRupees(tournament.prizeMoney) }] : []),
    { label: 'Players per side', value: String(tournament.playersPerSide) },
    {
      label: 'Substitutes per side',
      value: tournament.substitutesPerSide === 0 ? 'None' : String(tournament.substitutesPerSide),
    },
  ]

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {info.map((item) => (
        <div key={item.label} className="rounded-xl bg-gray-50 p-3.5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default TournamentInfoGrid
