import { Navigate, useParams } from 'react-router-dom'
import FullPageLoader from '../components/FullPageLoader'
import RetryPanel from '../components/RetryPanel'
import SquadForm from '../components/SquadForm'
import { useSquads } from '../hooks/useSquads'
import { isScoringOpen } from '../lib/scoringWindow'
import { useScorerStore } from '../store/scorerStore'

function ScorerPlayersPage() {
  const { token } = useParams()
  const match = useScorerStore((state) => state.match)
  const scoringOpensAt = useScorerStore((state) => state.scoringOpensAt)
  const serverOffsetMs = useScorerStore((state) => state.serverOffsetMs)
  const { squads, loading, failed, saving, version, retry, save } = useSquads()

  const backTo = `/scorer/${token}/welcome`

  if (!match || !isScoringOpen(scoringOpensAt, serverOffsetMs)) return <Navigate to={backTo} replace />
  if (loading) return <FullPageLoader />

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <main className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Players</h1>
        <p className="mt-1 text-sm text-gray-600">
          {match.teamA.name} vs {match.teamB.name}. Name 11 players and 4 substitutes per team; you can come back and
          change them any time.
        </p>

        <div className="mt-5">
          {failed || !squads ? (
            <RetryPanel message="Couldn't load the players." onRetry={retry} />
          ) : (
            <SquadForm key={version} squads={squads} saving={saving} backTo={backTo} onSave={save} />
          )}
        </div>
      </main>
    </div>
  )
}

export default ScorerPlayersPage
