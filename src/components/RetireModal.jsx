import { useState } from 'react'
import ChoiceGrid from './ChoiceGrid'
import ModalShell from './ModalShell'

const TYPES = [
  { value: 'retired_hurt', label: 'Retired hurt' },
  { value: 'retired_out', label: 'Retired out' },
]

function RetireModal({ current, busy, onClose, onSubmit }) {
  const [playerId, setPlayerId] = useState(current.striker.playerId)
  const [type, setType] = useState('retired_hurt')

  return (
    <ModalShell
      title="Retire a batter"
      subtitle="Retired hurt can come back later. Retired out counts as a wicket."
      onClose={busy ? undefined : onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(playerId, type)}
            disabled={busy}
            className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Retire batter'}
          </button>
        </>
      }
    >
      <ChoiceGrid
        label="Who is leaving?"
        options={[
          { value: current.striker.playerId, label: current.striker.name },
          { value: current.nonStriker.playerId, label: current.nonStriker.name },
        ]}
        value={playerId}
        onChange={setPlayerId}
        columns={2}
      />
      <ChoiceGrid label="How?" options={TYPES} value={type} onChange={setType} columns={2} />
    </ModalShell>
  )
}

export default RetireModal
