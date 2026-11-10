import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { inputClass, labelClass } from '../lib/formStyles'
import { MAX_OVERS_PER_SIDE, MIN_OVERS_PER_SIDE } from '../lib/overs'
import { oversPerSideValidation } from '../lib/validators'
import FieldError from './FieldError'

const BLOCKED_KEYS = ['e', 'E', '+', '-', '.', ',']

function OversModal({ match, submitting, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { oversPerSide: match.oversPerSide ? String(match.oversPerSide) : '' } })

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !submitting) onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, submitting])

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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={submitting ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="overs-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-sm sm:rounded-2xl"
      >
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 id="overs-title" className="text-lg font-extrabold text-gray-900">
            Overs per side
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {match.teamA.name} vs {match.teamB.name}
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5">
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
          </div>

          <div className="flex gap-3 border-t border-gray-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-600"
            >
              {submitting ? 'Saving…' : 'Save overs'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OversModal
