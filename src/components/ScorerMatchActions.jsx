import { Coins, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSquads } from '../hooks/useSquads'
import { notifyInfo } from '../lib/notify'
import { saveToss } from '../lib/scorerApi'
import { handleScorerError } from '../lib/scorerErrors'
import { SQUAD_SIZE, savedCount, tossSummary } from '../lib/squad'
import { useScorerStore } from '../store/scorerStore'
import TossModal from './TossModal'

const actionClass =
  'flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700'

function ScorerMatchActions({ match }) {
  const { token } = useParams()
  const setMatch = useScorerStore((state) => state.setMatch)
  const { squads } = useSquads()
  const [tossOpen, setTossOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const submitToss = async (values) => {
    setSaving(true)
    try {
      setMatch(await saveToss(values))
      notifyInfo('Toss saved.')
      setTossOpen(false)
    } catch (error) {
      handleScorerError(error)
    } finally {
      setSaving(false)
    }
  }

  const toss = tossSummary(match)

  return (
    <div className="mt-5 space-y-3">
      <Link to={`/scorer/${token}/players`} className={actionClass}>
        <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
        Add players
        {squads && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {savedCount(squads.teamA)}/{SQUAD_SIZE} · {savedCount(squads.teamB)}/{SQUAD_SIZE}
          </span>
        )}
      </Link>

      <button type="button" onClick={() => setTossOpen(true)} className={actionClass}>
        <Coins className="h-4 w-4 shrink-0" aria-hidden="true" />
        Toss
      </button>
      {toss && <p className="text-center text-xs font-semibold text-gray-700">{toss}</p>}

      {tossOpen && (
        <TossModal match={match} submitting={saving} onClose={() => setTossOpen(false)} onSubmit={submitToss} />
      )}
    </div>
  )
}

export default ScorerMatchActions
