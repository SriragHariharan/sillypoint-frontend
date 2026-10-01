import { Link } from 'react-router-dom'
import Avatar from './Avatar'

function TeamCard({ team }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <Avatar src={team.logo} name={team.name} rounded="rounded-xl" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-gray-900">{team.name}</h3>
        </div>
        <Link
          to={`/teams/${team.id}/edit`}
          aria-label={`Edit ${team.name}`}
          className="shrink-0 rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
        >
          Edit
        </Link>
      </div>

      <dl className="mt-4 space-y-1.5 text-sm text-gray-600">
        <div className="flex gap-2">
          <dt className="font-medium text-gray-700">Captain:</dt>
          <dd className="truncate">{team.captain_name}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-700">Mobile:</dt>
          <dd>+91 {team.captain_mobile}</dd>
        </div>
      </dl>
    </div>
  )
}

export default TeamCard
