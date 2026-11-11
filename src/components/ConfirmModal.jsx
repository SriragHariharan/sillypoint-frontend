import ModalFooter from './ModalFooter'
import ModalShell from './ModalShell'

function ConfirmModal({ title, message, confirmLabel, busy, onClose, onConfirm }) {
  return (
    <ModalShell
      title={title}
      onClose={busy ? undefined : onClose}
      footer={
        <ModalFooter
          onCancel={onClose}
          cancelDisabled={busy}
          onConfirm={onConfirm}
          confirmDisabled={busy}
          confirmLabel={busy ? 'Saving…' : confirmLabel}
        />
      }
    >
      <p className="text-sm text-gray-700">{message}</p>
    </ModalShell>
  )
}

export default ConfirmModal
