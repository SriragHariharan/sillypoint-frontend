import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  EITHER_END_WICKETS,
  FIELDER_ALLOWED_WICKETS,
  FIELDER_REQUIRED_WICKETS,
  WICKET_LABELS,
  wicketTypesFor,
} from '../lib/scoringRules'
import ChoiceGrid from './ChoiceGrid'
import ModalFooter from './ModalFooter'
import ModalShell from './ModalShell'
import Select from './Select'

const BALL_TYPES = [
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
  { value: 'no_ball', label: 'No ball' },
]
const RUNS_BEFORE = [0, 1, 2, 3].map((value) => ({ value, label: String(value) }))

function WicketModal({ current, fielders, busy, onClose, onSubmit }) {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: { ballType: 'normal', type: '', dismissedId: current.striker.playerId, fielderId: '', runs: 0 },
  })
  const { ballType, type, fielderId } = useWatch({ control })

  const allowed = wicketTypesFor({ ballType, isFreeHit: current.isFreeHit })
  const typeOptions = allowed.map((value) => ({ value, label: WICKET_LABELS[value] }))
  const eitherEnd = EITHER_END_WICKETS.includes(type)
  const needsFielder = FIELDER_REQUIRED_WICKETS.includes(type)
  const canNameFielder = FIELDER_ALLOWED_WICKETS.includes(type)
  const ready = type && (!needsFielder || fielderId)

  const fielderOptions = fielders.map((player) => ({
    value: String(player.id),
    label: player.squad === 'substitute' ? `${player.name} (substitute)` : player.name,
  }))

  const submit = (values) =>
    onSubmit({
      runs: EITHER_END_WICKETS.includes(values.type) ? values.runs : 0,
      isBoundary: false,
      overthrowRuns: 0,
      extra: values.ballType === 'normal' ? null : { type: values.ballType, runKind: 'bat' },
      wicket: {
        type: values.type,
        dismissedPlayerId: EITHER_END_WICKETS.includes(values.type) ? values.dismissedId : null,
        fielderId: FIELDER_ALLOWED_WICKETS.includes(values.type) && values.fielderId ? Number(values.fielderId) : null,
      },
    })

  return (
    <ModalShell
      title="Wicket"
      subtitle={current.isFreeHit ? 'Free hit: only a run out or obstructing the field is possible' : undefined}
      onClose={busy ? undefined : onClose}
      footer={
        <ModalFooter
          onCancel={onClose}
          cancelDisabled={busy}
          onConfirm={handleSubmit(submit)}
          confirmDisabled={busy || !ready}
          confirmLabel={busy ? 'Saving…' : 'Save wicket'}
        />
      }
    >
      <Controller
        name="ballType"
        control={control}
        render={({ field }) => (
          <ChoiceGrid
            label="Type of ball"
            options={BALL_TYPES}
            value={field.value}
            onChange={(value) => {
              field.onChange(value)
              if (!wicketTypesFor({ ballType: value, isFreeHit: current.isFreeHit }).includes(type)) setValue('type', '')
            }}
            columns={3}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <ChoiceGrid label="How is the batter out?" options={typeOptions} value={field.value} onChange={field.onChange} columns={2} />
        )}
      />

      {eitherEnd && (
        <>
          <Controller
            name="dismissedId"
            control={control}
            render={({ field }) => (
              <ChoiceGrid
                label="Who is out?"
                options={[
                  { value: current.striker.playerId, label: `${current.striker.name} (on strike)` },
                  { value: current.nonStriker.playerId, label: current.nonStriker.name },
                ]}
                value={field.value}
                onChange={field.onChange}
                columns={2}
              />
            )}
          />
          <Controller
            name="runs"
            control={control}
            render={({ field }) => (
              <ChoiceGrid label="Runs completed before the run out" options={RUNS_BEFORE} value={field.value} onChange={field.onChange} />
            )}
          />
        </>
      )}

      {canNameFielder && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            {type === 'caught' ? 'Who took the catch?' : type === 'stumped' ? 'Who is the wicket keeper?' : 'Who made the run out? (optional)'}
          </p>
          <Controller
            name="fielderId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onChange={field.onChange} options={fielderOptions} placeholder="Select fielder" />
            )}
          />
          <div className="h-48" aria-hidden="true" />
        </div>
      )}
    </ModalShell>
  )
}

export default WicketModal
