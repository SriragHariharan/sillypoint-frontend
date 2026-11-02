import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'

function TournamentHeader({ tournament }) {
  return (
    <>
      <Link to="/tournaments" className="text-sm font-medium text-gray-500 transition hover:text-red-600">
        ← All tournaments
      </Link>

      <header className="mt-4 flex items-start gap-4">
        <Avatar src={tournament.logo} name={tournament.name} size="lg" rounded="rounded-2xl" />
        <div className="min-w-0 flex-1">
          <StatusBadge status={tournament.status} />
          <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            {tournament.name}
          </h1>
        </div>
      </header>
    </>
  )
}

export default TournamentHeader
