import { Navigate, useParams } from 'react-router-dom'
import FullPageLoader from '../components/FullPageLoader'
import PageHeader from '../components/PageHeader'
import RetryPanel from '../components/RetryPanel'
import SquadForm from '../components/SquadForm'
import { useSquads } from '../hooks/useSquads'
import { isScoringOpen } from '../lib/scoringWindow'
import { squadLimits } from '../lib/squad'
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

  const limits = squadLimits(match.tournament)
  const allowed = limits.substitutes > 0 ? `${limits.playing} players and ${limits.substitutes} substitutes` : `${limits.playing} players`

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <main className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-8">
        <PageHeader
          size="md"
          eyebrow="Squads"
          title={
            <>
              Match <span className="text-red-600">players</span>
            </>
          }
          subtitle={`${match.teamA.name} vs ${match.teamB.name}. Name up to ${allowed} per team; you can come back and change them any time.`}
        />

        <div className="mt-5">
          {failed || !squads ? (
            <RetryPanel message="Couldn't load the players." onRetry={retry} />
          ) : (
            <SquadForm key={version} squads={squads} limits={limits} saving={saving} backTo={backTo} onSave={save} />
          )}
        </div>
      </main>
    </div>
  )
}

export default ScorerPlayersPage
