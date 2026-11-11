import { useState } from 'react'
import { getErrorMessage } from '../lib/api'
import { notifyError, notifyInfo } from '../lib/notify'
import {
  cardClass,
  dangerOutlineButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '../lib/premiumStyles'
import { cancelTournament, rescheduleTournament, updateTournamentPrizeMoney } from '../lib/tournamentApi'
import ManageCancelConfirm from './ManageCancelConfirm'
import ManagePrizeForm from './ManagePrizeForm'
import ManageRescheduleForm from './ManageRescheduleForm'

function ManageTournament({ tournament, onChanged }) {
  const [mode, setMode] = useState(null)
  const [busy, setBusy] = useState(false)

  const run = async (action, successMessage) => {
    setBusy(true)
    try {
      const updated = await action()
      notifyInfo(successMessage)
      setMode(null)
      onChanged(updated)
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  const updatePrize = ({ prizeMoney }) =>
    run(() => updateTournamentPrizeMoney(tournament.id, Number(prizeMoney)), 'Prize money updated.')
  const reschedule = (values) => run(() => rescheduleTournament(tournament.id, values), 'Tournament rescheduled.')
  const cancel = () => run(() => cancelTournament(tournament.id), 'Tournament cancelled.')
  const back = () => setMode(null)

  return (
    <section className={`${cardClass} p-4 sm:p-5`}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-red-700">Manage tournament</h2>

      {mode === null && (
        <div className="mt-3 flex flex-col gap-2">
          <button type="button" onClick={() => setMode('reschedule')} className={`px-5 ${primaryButtonClass}`}>
            Reschedule
          </button>
          <button type="button" onClick={() => setMode('prize')} className={`px-5 ${secondaryButtonClass}`}>
            Edit prize money
          </button>
          <button type="button" onClick={() => setMode('cancel')} className={`px-5 ${dangerOutlineButtonClass}`}>
            Cancel tournament
          </button>
        </div>
      )}

      {mode === 'reschedule' && (
        <ManageRescheduleForm tournament={tournament} busy={busy} onSubmit={reschedule} onBack={back} />
      )}
      {mode === 'prize' && <ManagePrizeForm tournament={tournament} busy={busy} onSubmit={updatePrize} onBack={back} />}
      {mode === 'cancel' && <ManageCancelConfirm busy={busy} onConfirm={cancel} onBack={back} />}
    </section>
  )
}

export default ManageTournament
