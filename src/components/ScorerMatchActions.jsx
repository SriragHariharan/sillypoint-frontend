import { Coins, Play, Timer, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSquads } from '../hooks/useSquads'
import { notifyError, notifyInfo } from '../lib/notify'
import { oversSummary } from '../lib/overs'
import { primaryButtonClass } from '../lib/premiumStyles'
import { saveOvers, saveToss } from '../lib/scorerApi'
import { handleScorerError } from '../lib/scorerErrors'
import { isMatchReady, savedCount, squadLimits, tossSummary } from '../lib/squad'
import { useScorerStore } from '../store/scorerStore'
import OversModal from './OversModal'
import TossModal from './TossModal'

const actionClass = `flex w-full items-center justify-center gap-2 px-5 ${primaryButtonClass}`
const halfClass = `flex w-full items-center justify-center gap-1.5 px-2 text-center leading-tight ${primaryButtonClass}`

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

  const locked = Boolean(match.scoringStartedAt)
  const toss = tossSummary(match)
  const overs = oversSummary(match)
  const { total } = squadLimits(match.tournament)

  return (
    <div className="mt-5 space-y-3">
      {locked && (
        <p className="rounded-xl bg-gray-50 px-3 py-2 text-center text-xs font-semibold text-gray-600">
          Scoring has started, so the players, toss and overs can no longer be changed.
        </p>
      )}

      {locked ? (
        <button type="button" disabled className={actionClass}>
          <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
          Add players
        </button>
      ) : (
        <Link to={`/scorer/${token}/players`} className={actionClass}>
          <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
          Add players
          {squads && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {savedCount(squads.teamA)}/{total} · {savedCount(squads.teamB)}/{total}
            </span>
          )}
        </Link>
      )}

      <div className="grid grid-cols-2 items-start gap-3">
        <div className="space-y-3">
          <button type="button" disabled={locked} onClick={() => setTossOpen(true)} className={halfClass}>
            <Coins className="h-4 w-4 shrink-0" aria-hidden="true" />
            Toss
          </button>
          {toss && <p className="text-center text-xs font-semibold text-gray-700">{toss}</p>}
        </div>

        <div className="space-y-3">
          <button type="button" disabled={locked} onClick={() => setOversOpen(true)} className={halfClass}>
            <Timer className="h-4 w-4 shrink-0" aria-hidden="true" />
            Overs per side
          </button>
          {overs && <p className="text-center text-xs font-semibold text-gray-700">{overs}</p>}
        </div>
      </div>

      <button type="button" onClick={startScoring} className={actionClass}>
        <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
        {locked ? 'Continue scoring' : 'Start scoring'}
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
