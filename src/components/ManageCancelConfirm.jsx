import { infoNoteClass } from '../lib/premiumStyles'
import ModalFooter from './ModalFooter'

function ManageCancelConfirm({ busy, onConfirm, onBack }) {
  return (
    <div className={`mt-3 ${infoNoteClass}`}>
      <p className="text-sm font-semibold text-gray-900">Cancel this tournament?</p>
      <p className="mt-1 text-xs text-gray-600">This cannot be undone.</p>
      <div className="mt-3 flex gap-2">
        <ModalFooter
          cancelLabel="No"
          onCancel={onBack}
          cancelDisabled={busy}
          onConfirm={onConfirm}
          confirmDisabled={busy}
          confirmLabel={busy ? 'Cancelling…' : 'Yes, cancel'}
        />
      </div>
    </div>
  )
}

export default ManageCancelConfirm
