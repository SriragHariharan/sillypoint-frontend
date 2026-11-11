import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
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
        <Avatar src={tournament.logo} name={tournament.name} size="lg" rounded="rounded-2xl" />
        <div className="min-w-0 flex-1">
          <StatusBadge status={tournament.status} />
          <h1 className={`mt-2 text-2xl sm:text-4xl ${headingClass}`}>{tournament.name}</h1>
        </div>
      </header>
    </>
  )
}

export default TournamentHeader
