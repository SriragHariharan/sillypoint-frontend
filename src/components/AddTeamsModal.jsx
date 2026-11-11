import { useState } from 'react'
import Avatar from './Avatar'
import ModalFooter from './ModalFooter'
import ModalShell from './ModalShell'

function AddTeamsModal({ teams, addedIds, adding, onClose, onConfirm }) {
  const [selected, setSelected] = useState([])

  const toggle = (id) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  const confirm = () => onConfirm(teams.filter((team) => selected.includes(team.id)))

  return (
    <ModalShell
      title="Add your teams"
      subtitle="Select one or more teams to add to this tournament."
      onClose={onClose}
      busy={adding}
      footer={
        <ModalFooter
          onCancel={onClose}
          cancelDisabled={adding}
          onConfirm={confirm}
          confirmDisabled={selected.length === 0 || adding}
          confirmLabel={adding ? 'Adding…' : selected.length > 0 ? `Add Teams (${selected.length})` : 'Add Teams'}
        />
      }
    >
      <ul className="space-y-2">
        {teams.map((team) => {
          const added = addedIds.includes(team.id)
          const checked = added || selected.includes(team.id)
          return (
            <li key={team.id}>
              <label
                className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                  added
                    ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                    : checked
                      ? 'cursor-pointer border-red-600 bg-red-50 shadow-sm'
                      : 'cursor-pointer border-gray-200 bg-white hover:border-red-600'
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
                  <span className="block truncate text-xs text-gray-600">Manager: {team.manager_name}</span>
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
    </ModalShell>
  )
}

export default AddTeamsModal
