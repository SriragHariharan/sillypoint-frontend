import { useState } from 'react'
import Avatar from './Avatar'

function EnrolledTeamCard({ team, canRemove, onRemove }) {
  const [confirming, setConfirming] = useState(false)
  const [removing, setRemoving] = useState(false)

  const remove = async () => {
    setRemoving(true)
    await onRemove(team)
    setRemoving(false)
    setConfirming(false)
  }

  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar src={team.logo} name={team.name} size="sm" rounded="rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{team.name}</p>
          <p className="truncate text-xs text-gray-600">Captain: {team.captain_name}</p>
        </div>
        {canRemove && !confirming && (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="shrink-0 rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      {canRemove && confirming && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-red-50 px-3 py-2">
          <p className="text-xs font-semibold text-gray-900">Remove from tournament?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={removing}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
            >
              No
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={removing}
              className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
            >
              {removing ? 'Removing…' : 'Yes'}
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

export default EnrolledTeamCard
