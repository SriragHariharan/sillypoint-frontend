import ModalShell from './ModalShell'

function ConfirmModal({ title, message, confirmLabel, busy, onClose, onConfirm }) {
  return (
    <ModalShell
      title={title}
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
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Saving…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-700">{message}</p>
    </ModalShell>
  )
}

export default ConfirmModal
