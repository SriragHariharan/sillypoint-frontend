import { Coins, Play, Timer, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSquads } from '../hooks/useSquads'
import { notifyError, notifyInfo } from '../lib/notify'
import { oversSummary } from '../lib/overs'
import { saveOvers, saveToss } from '../lib/scorerApi'
import { handleScorerError } from '../lib/scorerErrors'
import { isMatchReady, savedCount, squadLimits, tossSummary } from '../lib/squad'
import { useScorerStore } from '../store/scorerStore'
import OversModal from './OversModal'
import TossModal from './TossModal'

const actionClass =
  'flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700'

function ScorerMatchActions({ match }) {
  const { token } = useParams()
  const navigate = useNavigate()
  const setMatch = useScorerStore((state) => state.setMatch)
  const { squads } = useSquads()
  const [tossOpen, setTossOpen] = useState(false)
  const [oversOpen, setOversOpen] = useState(false)
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

  const submitOvers = async (values) => {
    setSaving(true)
    try {
      setMatch(await saveOvers(values))
      notifyInfo('Overs saved.')
      setOversOpen(false)
    } catch (error) {
      handleScorerError(error)
    } finally {
      setSaving(false)
    }
  }

  const startScoring = () => {
    if (!isMatchReady(match, squads)) {
      notifyError('Before the start of the match, players must be nominated, the toss must be made and overs per side must be set.')
      return
    }
    navigate(`/scorer/${token}/scoring`)
  }

  const toss = tossSummary(match)
  const overs = oversSummary(match)
  const { total } = squadLimits(match.tournament)

  return (
    <div className="mt-5 space-y-3">
      <Link to={`/scorer/${token}/players`} className={actionClass}>
        <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
        Add players
        {squads && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {savedCount(squads.teamA)}/{total} · {savedCount(squads.teamB)}/{total}
          </span>
        )}
      </Link>

      <button type="button" onClick={() => setTossOpen(true)} className={actionClass}>
        <Coins className="h-4 w-4 shrink-0" aria-hidden="true" />
        Toss
      </button>
      {toss && <p className="text-center text-xs font-semibold text-gray-700">{toss}</p>}

      <button type="button" onClick={() => setOversOpen(true)} className={actionClass}>
        <Timer className="h-4 w-4 shrink-0" aria-hidden="true" />
        Overs per side
      </button>
      {overs && <p className="text-center text-xs font-semibold text-gray-700">{overs}</p>}

      <button type="button" onClick={startScoring} className={actionClass}>
        <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
        Start scoring
      </button>

      {oversOpen && (
        <OversModal match={match} submitting={saving} onClose={() => setOversOpen(false)} onSubmit={submitOvers} />
      )}

      {tossOpen && (
        <TossModal match={match} submitting={saving} onClose={() => setTossOpen(false)} onSubmit={submitToss} />
      )}
    </div>
  )
}

export default ScorerMatchActions
