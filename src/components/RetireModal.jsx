import { useState } from 'react'
import ChoiceGrid from './ChoiceGrid'
import ModalFooter from './ModalFooter'
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
        <ModalFooter
          onCancel={onClose}
          cancelDisabled={busy}
          onConfirm={() => onSubmit(playerId, type)}
          confirmDisabled={busy}
          confirmLabel={busy ? 'Saving…' : 'Retire batter'}
        />
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
