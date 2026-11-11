import { Controller, useForm } from 'react-hook-form'
import { labelClass } from '../lib/formStyles'
import { primaryButtonClass, secondaryButtonClass } from '../lib/premiumStyles'
import FieldError from './FieldError'
import ModalFooter from './ModalFooter'
import ModalShell from './ModalShell'
import Select from './Select'

const DECISIONS = [
  { value: 'bat', label: 'Batting' },
  { value: 'bowl', label: 'Bowling' },
]

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

  const teamOptions = [match.teamA, match.teamB].map((team) => ({
    value: String(team.id),
    label: team.name,
    logo: team.logo,
  }))

  const submit = (values) => onSubmit({ winnerTeamId: Number(values.winnerTeamId), decision: values.decision })

  return (
    <ModalShell
      title="Toss"
      subtitle={`${match.teamA.name} vs ${match.teamB.name}`}
      onClose={onClose}
      busy={submitting}
      footer={
        <ModalFooter
          form="toss-form"
          onCancel={onClose}
          cancelDisabled={submitting}
          confirmDisabled={submitting}
          confirmLabel={submitting ? 'Saving…' : 'Save toss'}
        />
      }
    >
      <form id="toss-form" onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
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
          <FieldError error={errors.winnerTeamId} />
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
                      className={`px-5 ${selected ? primaryButtonClass : secondaryButtonClass}`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            )}
          />
          <FieldError error={errors.decision} />
        </div>
      </form>
    </ModalShell>
  )
}

export default TossModal
