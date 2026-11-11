import { useForm } from 'react-hook-form'
import { inputClass, labelClass } from '../lib/formStyles'
import { MAX_OVERS_PER_SIDE, MIN_OVERS_PER_SIDE } from '../lib/overs'
import { oversPerSideValidation } from '../lib/validators'
import FieldError from './FieldError'
import ModalFooter from './ModalFooter'
import ModalShell from './ModalShell'

const BLOCKED_KEYS = ['e', 'E', '+', '-', '.', ',']

function OversModal({ match, submitting, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { oversPerSide: match.oversPerSide ? String(match.oversPerSide) : '' } })

  const blockNonDigits = (event) => {
    if (BLOCKED_KEYS.includes(event.key)) event.preventDefault()
  }

  const pasteDigitsOnly = (event) => {
    event.preventDefault()
    const digits = event.clipboardData.getData('text').replace(/\D/g, '')
    setValue('oversPerSide', digits, { shouldValidate: true, shouldDirty: true })
  }

  const submit = (values) => onSubmit({ oversPerSide: Number(values.oversPerSide) })

  return (
    <ModalShell
      title="Overs per side"
      subtitle={`${match.teamA.name} vs ${match.teamB.name}`}
      onClose={onClose}
      busy={submitting}
      size="sm"
      footer={
        <ModalFooter
          form="overs-form"
          onCancel={onClose}
          cancelDisabled={submitting}
          confirmDisabled={submitting}
          confirmLabel={submitting ? 'Saving…' : 'Save overs'}
        />
      }
    >
      <form id="overs-form" onSubmit={handleSubmit(submit)} noValidate>
        <label htmlFor="oversPerSide" className={labelClass}>
          Number of overs
        </label>
        <input
          id="oversPerSide"
          type="number"
          inputMode="numeric"
          min={MIN_OVERS_PER_SIDE}
          max={MAX_OVERS_PER_SIDE}
          step={1}
          autoFocus
          placeholder="e.g. 20"
          onKeyDown={blockNonDigits}
          onPaste={pasteDigitsOnly}
          className={inputClass(errors.oversPerSide)}
          {...register('oversPerSide', oversPerSideValidation)}
        />
        <p className="mt-1.5 text-xs text-gray-500">
          {MIN_OVERS_PER_SIDE} to {MAX_OVERS_PER_SIDE} overs. You can change it any time.
        </p>
        <FieldError error={errors.oversPerSide} />
      </form>
    </ModalShell>
  )
}

export default OversModal
