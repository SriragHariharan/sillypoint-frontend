import { primaryButtonClass, secondaryButtonClass } from '../lib/premiumStyles'

function ModalFooter({
  onCancel,
  cancelLabel = 'Cancel',
  cancelDisabled = false,
  confirmLabel,
  confirmDisabled = false,
  onConfirm,
  form,
}) {
  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        disabled={cancelDisabled}
        className={`flex-1 px-5 ${secondaryButtonClass}`}
      >
        {cancelLabel}
      </button>
      <button
        type={form ? 'submit' : 'button'}
        form={form}
        onClick={onConfirm}
        disabled={confirmDisabled}
        className={`flex-1 px-5 ${primaryButtonClass}`}
      >
        {confirmLabel}
      </button>
    </>
  )
}

export default ModalFooter
