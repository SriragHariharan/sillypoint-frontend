import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { getErrorMessage } from '../lib/api'
import { notifyError, notifyInfo } from '../lib/notify'
import { cancelTournament, rescheduleTournament, updateTournamentPrizeMoney } from '../lib/tournamentApi'
import { endDateValidation, prizeMoneyValidation, startDateValidation, todayISO } from '../lib/validators'

const inputClass = (hasError) =>
  `w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 ${
    hasError ? 'border-red-400' : 'border-gray-300'
  }`

function ManageTournament({ tournament, onChanged }) {
  const [mode, setMode] = useState(null)
  const [busy, setBusy] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { startDate: tournament.startDate, endDate: tournament.endDate } })
  const startDate = useWatch({ control, name: 'startDate' })

  const {
    register: registerPrize,
    handleSubmit: handlePrizeSubmit,
    formState: { errors: prizeErrors },
  } = useForm({ defaultValues: { prizeMoney: String(tournament.prizeMoney) } })

  const updatePrize = async ({ prizeMoney }) => {
    setBusy(true)
    try {
      const updated = await updateTournamentPrizeMoney(tournament.id, Number(prizeMoney))
      notifyInfo('Prize money updated.')
      setMode(null)
      onChanged(updated)
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  const reschedule = async (values) => {
    setBusy(true)
    try {
      const updated = await rescheduleTournament(tournament.id, values)
      notifyInfo('Tournament rescheduled.')
      setMode(null)
      onChanged(updated)
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  const cancel = async () => {
    setBusy(true)
    try {
      const updated = await cancelTournament(tournament.id)
      notifyInfo('Tournament cancelled.')
      setMode(null)
      onChanged(updated)
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Manage tournament</h2>

      {mode === null && (
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setMode('reschedule')}
            className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Reschedule
          </button>
          <button
            type="button"
            onClick={() => setMode('prize')}
            className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
          >
            Edit prize money
          </button>
          <button
            type="button"
            onClick={() => setMode('cancel')}
            className="rounded-full border border-red-600 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Cancel tournament
          </button>
        </div>
      )}

      {mode === 'reschedule' && (
        <form onSubmit={handleSubmit(reschedule)} noValidate className="mt-3 space-y-3">
          <div>
            <label htmlFor="rescheduleStart" className="mb-1.5 block text-sm font-medium text-gray-700">
              Start date
            </label>
            <input
              id="rescheduleStart"
              type="date"
              min={todayISO()}
              className={inputClass(errors.startDate)}
              {...register('startDate', { ...startDateValidation, deps: ['endDate'] })}
            />
            {errors.startDate && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.startDate.message}</p>}
          </div>
          <div>
            <label htmlFor="rescheduleEnd" className="mb-1.5 block text-sm font-medium text-gray-700">
              End date
            </label>
            <input
              id="rescheduleEnd"
              type="date"
              min={startDate || todayISO()}
              className={inputClass(errors.endDate)}
              {...register('endDate', endDateValidation(() => getValues('startDate')))}
            />
            {errors.endDate && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.endDate.message}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode(null)}
              disabled={busy}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save dates'}
            </button>
          </div>
        </form>
      )}

      {mode === 'prize' && (
        <form onSubmit={handlePrizeSubmit(updatePrize)} noValidate className="mt-3 space-y-3">
          <div>
            <label htmlFor="editPrizeMoney" className="mb-1.5 block text-sm font-medium text-gray-700">
              Prize money (₹)
            </label>
            <input
              id="editPrizeMoney"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              className={inputClass(prizeErrors.prizeMoney)}
              {...registerPrize('prizeMoney', prizeMoneyValidation)}
            />
            {prizeErrors.prizeMoney && (
              <p className="mt-1.5 text-xs font-medium text-red-600">{prizeErrors.prizeMoney.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode(null)}
              disabled={busy}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {mode === 'cancel' && (
        <div className="mt-3 rounded-xl bg-red-50 p-3">
          <p className="text-sm font-semibold text-gray-900">Cancel this tournament?</p>
          <p className="mt-1 text-xs text-gray-600">This cannot be undone.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMode(null)}
              disabled={busy}
              className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
            >
              No
            </button>
            <button
              type="button"
              onClick={cancel}
              disabled={busy}
              className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? 'Cancelling…' : 'Yes, cancel'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default ManageTournament
