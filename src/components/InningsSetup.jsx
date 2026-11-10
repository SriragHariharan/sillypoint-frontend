import { Controller, useForm, useWatch } from 'react-hook-form'
import { endReasonText, nextBattingTeam, otherTeam, playersOf, teamById } from '../lib/scoringTeams'
import Select from './Select'

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'
const errorClass = 'mt-1.5 text-xs font-medium text-red-600'

function InningsSetup({ data, busy, onStart, onUndo }) {
  const { match, innings, players, nextInnings } = data
  const batting = nextBattingTeam(data)
  const bowling = otherTeam(match, batting.id)
  const first = innings[0]

  const { control, handleSubmit } = useForm({ defaultValues: { strikerId: '', nonStrikerId: '', bowlerId: '' } })
  const { strikerId, nonStrikerId } = useWatch({ control })

  const options = (teamId, exceptValue) =>
    playersOf(players, teamId).map((player) => ({
      value: String(player.id),
      label: player.name,
      disabled: String(player.id) === exceptValue,
    }))

  const submit = (values) =>
    onStart({
      strikerId: Number(values.strikerId),
      nonStrikerId: Number(values.nonStrikerId),
      bowlerId: Number(values.bowlerId),
    })

  const field = (name, label, teamOptions, placeholder) => (
    <div>
      <label className={labelClass}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={{ required: 'Choose a player' }}
        render={({ field: input, fieldState }) => (
          <>
            <Select value={input.value} onChange={input.onChange} options={teamOptions} placeholder={placeholder} error={Boolean(fieldState.error)} />
            {fieldState.error && <p className={errorClass}>{fieldState.error.message}</p>}
          </>
        )}
      />
    </div>
  )

  return (
    <section className="mx-auto my-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      {first && (
        <div className="mb-5 rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Innings break</p>
          <p className="mt-1 text-base font-extrabold text-gray-900">
            {teamById(match, first.battingTeamId).name} {first.runs}/{first.wickets} in {first.overs} overs
          </p>
          <p className="mt-1 text-xs text-gray-500">{endReasonText(first.endReason)}</p>
          <p className="mt-2 text-sm font-semibold text-red-700">
            {batting.name} need {first.runs + 1} runs to win
          </p>
        </div>
      )}

      <h2 className="text-lg font-extrabold text-gray-900">{nextInnings === 1 ? 'Start the match' : 'Start the second innings'}</h2>
      <p className="mt-1 text-sm text-gray-600">
        {batting.name} bat, {bowling.name} bowl.
      </p>

      <form onSubmit={handleSubmit(submit)} noValidate className="mt-5 space-y-4">
        {field('strikerId', 'Opening batter on strike', options(batting.id, nonStrikerId), 'Select batter')}
        {field('nonStrikerId', 'Opening batter at the other end', options(batting.id, strikerId), 'Select batter')}
        {field('bowlerId', 'Opening bowler', options(bowling.id, ''), 'Select bowler')}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Starting…' : 'Start innings'}
        </button>
        {first && (
          <button
            type="button"
            onClick={onUndo}
            disabled={busy}
            className="w-full rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
          >
            Undo last ball of the first innings
          </button>
        )}
      </form>
    </section>
  )
}

export default InningsSetup
