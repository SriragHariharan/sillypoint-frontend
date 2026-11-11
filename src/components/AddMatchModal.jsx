import { Controller, useForm, useWatch } from 'react-hook-form'
import { inputClass, labelClass } from '../lib/formStyles'
import { MATCH_STAGES } from '../lib/matchStages'
import { infoNoteClass } from '../lib/premiumStyles'
import FieldError from './FieldError'
import MatchScheduleFields from './MatchScheduleFields'
import ModalFooter from './ModalFooter'
import ModalShell from './ModalShell'
import Select from './Select'

const NOTES_MAX_LENGTH = 500

const STAGE_OPTIONS = [{ value: '', label: 'None' }, ...MATCH_STAGES]

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
          <FieldError error={fieldState.error} />
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
    <ModalShell
      title="Add match"
      subtitle="Pick two teams and schedule when they play."
      onClose={onClose}
      busy={submitting}
      size="xl"
      footer={
        <ModalFooter
          form="add-match-form"
          onCancel={onClose}
          cancelDisabled={submitting}
          confirmDisabled={!canCreate || submitting}
          confirmLabel={submitting ? 'Creating…' : 'Create Match'}
        />
      }
    >
      <form id="add-match-form" onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
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
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black tracking-wider text-white">
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

            <MatchScheduleFields
              register={register}
              errors={errors}
              tournament={tournament}
              idPrefix="match"
              dateLabel="Match date"
              timeLabel="Start time"
            />

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
                className={`${inputClass(false)} resize-none`}
                {...register('notes')}
              />
            </div>
          </>
        ) : (
          <p className={`${infoNoteClass} text-center text-sm text-gray-700`}>
            At least two teams must join this tournament before you can schedule a match.
          </p>
        )}
      </form>
    </ModalShell>
  )
}

export default AddMatchModal
