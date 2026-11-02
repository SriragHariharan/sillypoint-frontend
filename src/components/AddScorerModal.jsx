import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { scorerMobileValidation, scorerNameValidation } from '../lib/validators'

const fieldClass = (hasError) =>
  `w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 ${
    hasError ? 'border-red-400' : 'border-gray-300'
  }`

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'
const errorClass = 'mt-1.5 text-xs font-medium text-red-600'

function AddScorerModal({ match, submitting, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', mobile: '' } })

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

  const submit = (values) => onSubmit({ name: values.name.trim(), mobile: values.mobile })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={submitting ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-scorer-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl"
      >
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 id="add-scorer-title" className="text-lg font-extrabold text-gray-900">
            Add scorer
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {match.teamA.name} vs {match.teamB.name}
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <div>
              <label htmlFor="scorer-name" className={labelClass}>
                Scorer name
              </label>
              <input
                id="scorer-name"
                type="text"
                autoComplete="off"
                maxLength={60}
                className={fieldClass(Boolean(errors.name))}
                {...register('name', scorerNameValidation)}
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="scorer-mobile" className={labelClass}>
                Scorer mobile
              </label>
              <input
                id="scorer-mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="off"
                maxLength={10}
                placeholder="9876543210"
                className={fieldClass(Boolean(errors.mobile))}
                {...register('mobile', scorerMobileValidation)}
              />
              {errors.mobile && <p className={errorClass}>{errors.mobile.message}</p>}
            </div>
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
              {submitting ? 'Adding…' : 'Add scorer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddScorerModal
