import { useState } from 'react'
import {
  cardClass,
  compactPrimaryButtonClass,
  compactSecondaryButtonClass,
  infoNoteClass,
} from '../lib/premiumStyles'
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
    <li className={`${cardClass} p-4`}>
      <div className="flex items-center gap-3">
        <Avatar src={team.logo} name={team.name} size="sm" rounded="rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{team.name}</p>
          <p className="truncate text-xs text-gray-600">Captain: {team.captain_name}</p>
        </div>
        {canRemove && !confirming && (
          <button type="button" onClick={() => setConfirming(true)} className={`shrink-0 ${compactSecondaryButtonClass}`}>
            Remove
          </button>
        )}
      </div>

      {canRemove && confirming && (
        <div className={`mt-3 flex items-center justify-between gap-3 !px-3 !py-2 ${infoNoteClass}`}>
          <p className="text-xs font-semibold text-gray-900">Remove from tournament?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={removing}
              className={compactSecondaryButtonClass}
            >
              No
            </button>
            <button type="button" onClick={remove} disabled={removing} className={compactPrimaryButtonClass}>
              {removing ? 'Removing…' : 'Yes'}
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

export default EnrolledTeamCard
