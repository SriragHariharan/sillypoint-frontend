import ModalShell from './ModalShell'

function PlayerPickerModal({ title, subtitle, options, busy, onPick, onUndo, onClose }) {
  return (
    <ModalShell
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      footer={
        <>
          {onUndo && (
            <button
              type="button"
              onClick={onUndo}
              disabled={busy}
              className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Undo last ball
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
            >
              Cancel
            </button>
          )}
        </>
      }
    >
      <ul className="space-y-2">
        {options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              disabled={busy || Boolean(option.disabledReason)}
              onClick={() => onPick(option.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:hover:border-gray-300 disabled:hover:text-gray-400"
            >
              <span className="min-w-0 break-words">{option.name}</span>
              {(option.disabledReason || option.note) && (
                <span className="shrink-0 text-xs font-medium text-gray-500">{option.disabledReason ?? option.note}</span>
              )}
            </button>
          </li>
        ))}
        {options.length === 0 && <li className="text-sm text-gray-600">Nobody is available.</li>}
      </ul>
    </ModalShell>
  )
}

export default PlayerPickerModal
