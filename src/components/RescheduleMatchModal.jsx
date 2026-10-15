import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { matchDateInput, matchTimeInput } from '../lib/formatDate'
import { todayISO } from '../lib/validators'

const fieldClass = (hasError) =>
  `w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 ${
    hasError ? 'border-red-400' : 'border-gray-300'
  }`

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'
const errorClass = 'mt-1.5 text-xs font-medium text-red-600'

const nowTimeHHmm = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function RescheduleMatchModal({ match, submitting, onClose, onSubmit }) {
  const { tournament } = match
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { matchDate: matchDateInput(match.scheduledAt), matchTime: matchTimeInput(match.scheduledAt) },
  })

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

  const today = todayISO()
  const minDate = tournament.startDate > today ? tournament.startDate : today

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={submitting ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-match-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl"
      >
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 id="reschedule-match-title" className="text-lg font-extrabold text-gray-900">
            Reschedule match
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {match.teamA.name} vs {match.teamB.name}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="grid flex-1 gap-3 overflow-y-auto px-5 py-5 sm:grid-cols-2">
            <div>
              <label htmlFor="reschedule-date" className={labelClass}>
                New date
              </label>
              <input
                id="reschedule-date"
                type="date"
                min={minDate}
                max={tournament.endDate}
                className={fieldClass(Boolean(errors.matchDate))}
                {...register('matchDate', {
                  required: 'Select the match date',
                  validate: (value) =>
                    (value >= minDate && value <= tournament.endDate) || 'Date must be within the tournament dates',
                  deps: ['matchTime'],
                })}
              />
              {errors.matchDate && <p className={errorClass}>{errors.matchDate.message}</p>}
            </div>
            <div>
              <label htmlFor="reschedule-time" className={labelClass}>
                New start time
              </label>
              <input
                id="reschedule-time"
                type="time"
                className={fieldClass(Boolean(errors.matchTime))}
                {...register('matchTime', {
                  required: 'Select the start time',
                  validate: (value, values) =>
                    values.matchDate !== today || value > nowTimeHHmm() || 'Start time cannot be in the past',
                })}
              />
              {errors.matchTime && <p className={errorClass}>{errors.matchTime.message}</p>}
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
              {submitting ? 'Rescheduling…' : 'Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RescheduleMatchModal
