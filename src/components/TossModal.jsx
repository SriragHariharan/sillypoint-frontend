import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Select from './Select'

const DECISIONS = [
  { value: 'bat', label: 'Batting' },
  { value: 'bowl', label: 'Bowling' },
]

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'
const errorClass = 'mt-1.5 text-xs font-medium text-red-600'

function TossModal({ match, submitting, onClose, onSubmit }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      winnerTeamId: match.tossWinnerTeamId ? String(match.tossWinnerTeamId) : '',
      decision: match.tossDecision ?? '',
    },
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

  const teamOptions = [match.teamA, match.teamB].map((team) => ({
    value: String(team.id),
    label: team.name,
    logo: team.logo,
  }))

  const submit = (values) => onSubmit({ winnerTeamId: Number(values.winnerTeamId), decision: values.decision })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={submitting ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="toss-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl"
      >
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 id="toss-title" className="text-lg font-extrabold text-gray-900">
            Toss
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {match.teamA.name} vs {match.teamB.name}
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <div>
              <label htmlFor="toss-winner" className={labelClass}>
                Who won the toss?
              </label>
              <Controller
                name="winnerTeamId"
                control={control}
                rules={{ required: 'Pick the team that won the toss' }}
                render={({ field, fieldState }) => (
                  <Select
                    id="toss-winner"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={teamOptions}
                    placeholder="Select team"
                    error={Boolean(fieldState.error)}
                  />
                )}
              />
              {errors.winnerTeamId && <p className={errorClass}>{errors.winnerTeamId.message}</p>}
            </div>

            <div>
              <span id="toss-decision-label" className={labelClass}>
                They chose to
              </span>
              <Controller
                name="decision"
                control={control}
                rules={{ required: 'Choose batting or bowling' }}
                render={({ field }) => (
                  <div role="radiogroup" aria-labelledby="toss-decision-label" className="grid grid-cols-2 gap-3">
                    {DECISIONS.map((option) => {
                      const selected = field.value === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => field.onChange(option.value)}
                          className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                            selected
                              ? 'border-red-600 bg-red-600 text-white'
                              : 'border-gray-300 bg-white text-gray-800 hover:border-red-600 hover:text-red-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              />
              {errors.decision && <p className={errorClass}>{errors.decision.message}</p>}
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
              {submitting ? 'Saving…' : 'Save toss'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TossModal
