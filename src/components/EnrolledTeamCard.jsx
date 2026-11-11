import { Phone } from 'lucide-react'
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
    <li className={`${cardClass} p-4 sm:p-5`}>
      <div className="flex items-start gap-3">
        <Avatar src={team.logo} name={team.name} size="md" rounded="rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-gray-900">{team.name}</p>
          <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Manager</p>
          <p className="truncate text-sm font-semibold text-gray-800">{team.manager_name}</p>
          {team.manager_mobile && (
            <a
              href={`tel:+91${team.manager_mobile}`}
              className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">+91 {team.manager_mobile}</span>
            </a>
          )}
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
