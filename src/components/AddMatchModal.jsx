import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { MATCH_STAGES } from '../lib/matchStages'
import { todayISO } from '../lib/validators'
import Select from './Select'

const NOTES_MAX_LENGTH = 500

const STAGE_OPTIONS = [{ value: '', label: 'None' }, ...MATCH_STAGES]

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

function TeamPicker({ id, label, name, control, rules, teams, otherId }) {
  const options = teams.map((team) => ({
    value: String(team.id),
    label: team.name,
    logo: team.logo,
    disabled: String(team.id) === otherId,
  }))

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="min-w-0">
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
          <Select
            id={id}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            options={options}
            placeholder="Select team"
            error={Boolean(fieldState.error)}
          />
          {fieldState.error && <p className={errorClass}>{fieldState.error.message}</p>}
        </div>
      )}
    />
  )
}

function AddMatchModal({ teams, tournament, submitting, onClose, onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { teamAId: '', teamBId: '', matchDate: '', matchTime: '', stage: '', notes: '' } })
  const [teamAId, teamBId, notes] = useWatch({ control, name: ['teamAId', 'teamBId', 'notes'] })

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
  const canCreate = teams.length >= 2

  const submit = (values) =>
    onSubmit({
      teamAId: Number(values.teamAId),
      teamBId: Number(values.teamBId),
      matchDate: values.matchDate,
      matchTime: values.matchTime,
      stage: values.stage || null,
      notes: values.notes.trim(),
    })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={submitting ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-match-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-xl sm:rounded-2xl"
      >
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 id="add-match-title" className="text-lg font-extrabold text-gray-900">
            Add match
          </h2>
          <p className="mt-1 text-sm text-gray-600">Pick two teams and schedule when they play.</p>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {canCreate ? (
              <>
                <div className="grid items-start gap-3 sm:grid-cols-[1fr_auto_1fr]">
                  <TeamPicker
                    id="match-team-a"
                    label="Team A"
                    name="teamAId"
                    control={control}
                    rules={{ required: 'Select team A', deps: ['teamBId'] }}
                    teams={teams}
                    otherId={teamBId}
                  />
                  <div className="flex items-center justify-center sm:mt-9" aria-hidden="true">
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold tracking-wider text-white">
                      VS
                    </span>
                  </div>
                  <TeamPicker
                    id="match-team-b"
                    label="Team B"
                    name="teamBId"
                    control={control}
                    rules={{
                      required: 'Select team B',
                      validate: (value, values) => value !== values.teamAId || 'Pick two different teams',
                    }}
                    teams={teams}
                    otherId={teamAId}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="match-date" className={labelClass}>
                      Match date
                    </label>
                    <input
                      id="match-date"
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
                    <label htmlFor="match-time" className={labelClass}>
                      Start time
                    </label>
                    <input
                      id="match-time"
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

                <div>
                  <label htmlFor="match-stage" className={labelClass}>
                    Match stage <span className="font-normal text-gray-500">(optional)</span>
                  </label>
                  <Controller
                    name="stage"
                    control={control}
                    render={({ field }) => (
                      <Select
                        id="match-stage"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={STAGE_OPTIONS}
                        placeholder="None"
                      />
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="match-notes" className={labelClass}>
                      Special notes <span className="font-normal text-gray-500">(optional)</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      {notes.length}/{NOTES_MAX_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="match-notes"
                    rows={3}
                    maxLength={NOTES_MAX_LENGTH}
                    placeholder="Ground, overs, umpires or anything players should know"
                    className={`${fieldClass(false)} resize-none`}
                    {...register('notes')}
                  />
                </div>
              </>
            ) : (
              <p className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-600">
                At least two teams must join this tournament before you can schedule a match.
              </p>
            )}
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
              disabled={!canCreate || submitting}
              className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-600"
            >
              {submitting ? 'Creating…' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMatchModal
