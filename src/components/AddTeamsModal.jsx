import { useEffect, useState } from 'react'
import Avatar from './Avatar'

function AddTeamsModal({ teams, addedIds, adding, onClose, onConfirm }) {
  const [selected, setSelected] = useState([])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !adding) onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, adding])

  const toggle = (id) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  const confirm = () => onConfirm(teams.filter((team) => selected.includes(team.id)))

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={adding ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-teams-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl"
      >
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 id="add-teams-title" className="text-lg font-extrabold text-gray-900">
            Add your teams
          </h2>
          <p className="mt-1 text-sm text-gray-600">Select one or more teams to add to this tournament.</p>
        </div>

        <ul className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
          {teams.map((team) => {
            const added = addedIds.includes(team.id)
            const checked = added || selected.includes(team.id)
            return (
              <li key={team.id}>
                <label
                  className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                    added
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                      : checked
                        ? 'cursor-pointer border-red-600 bg-red-50'
                        : 'cursor-pointer border-gray-200 hover:border-red-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={added}
                    onChange={() => toggle(team.id)}
                    className="h-5 w-5 shrink-0 accent-red-600"
                  />
                  <Avatar src={team.logo} name={team.name} size="sm" rounded="rounded-xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-900">{team.name}</span>
                    <span className="block truncate text-xs text-gray-600">Captain: {team.captain_name}</span>
                  </span>
                  {added && (
                    <span className="shrink-0 rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700">
                      Added
                    </span>
                  )}
                </label>
              </li>
            )
          })}
        </ul>

        <div className="flex gap-3 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={adding}
            className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={selected.length === 0 || adding}
            className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-600"
          >
            {adding ? 'Adding…' : selected.length > 0 ? `Add Teams (${selected.length})` : 'Add Teams'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTeamsModal
