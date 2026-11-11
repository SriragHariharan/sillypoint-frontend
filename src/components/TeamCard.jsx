import { Phone, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cardClass, cardHoverClass, compactSecondaryButtonClass } from '../lib/premiumStyles'
import Avatar from './Avatar'

function TeamCard({ team }) {
  return (
    <div className={`${cardClass} ${cardHoverClass} relative p-4 sm:p-5`}>
      <div className="flex items-start gap-3">
        <Avatar src={team.logo} name={team.name} rounded="rounded-xl" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-gray-900">
            <Link to={`/teams/${team.id}`} className="after:absolute after:inset-0 after:rounded-2xl">
              {team.name}
            </Link>
          </h3>
        </div>
        <Link
          to={`/teams/${team.id}/edit`}
          aria-label={`Edit ${team.name}`}
          className={`relative z-10 shrink-0 ${compactSecondaryButtonClass}`}
        >
          Edit
        </Link>
      </div>

      <dl className="mt-4 space-y-1.5 text-sm text-gray-600">
        <div className="flex gap-2">
          <dt className="sr-only">Captain</dt>
          <dd className="flex min-w-0 items-center gap-2">
            <User className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span className="truncate">Captain: {team.captain_name}</span>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Mobile</dt>
          <dd className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            +91 {team.captain_mobile}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export default TeamCard
