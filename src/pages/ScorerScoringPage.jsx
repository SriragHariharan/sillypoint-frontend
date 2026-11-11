import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FullPageLoader from '../components/FullPageLoader'
import InningsSetup from '../components/InningsSetup'
import MatchResultCard from '../components/MatchResultCard'
import RetryPanel from '../components/RetryPanel'
import ScorecardPanel from '../components/ScorecardPanel'
import ScoringScreen from '../components/ScoringScreen'
import { useScoring } from '../hooks/useScoring'
import { useSquads } from '../hooks/useSquads'
import { isScoringOpen } from '../lib/scoringWindow'
import { isMatchReady } from '../lib/squad'
import { useScorerStore } from '../store/scorerStore'

const tabClass = (active) =>
  `rounded-full px-3 py-1.5 text-xs font-semibold transition ${
    active ? 'bg-red-600 text-white' : 'text-gray-700 hover:text-red-600'
  }`

function ScorerScoringPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const match = useScorerStore((state) => state.match)
  const setMatch = useScorerStore((state) => state.setMatch)
  const scoringOpensAt = useScorerStore((state) => state.scoringOpensAt)
  const serverOffsetMs = useScorerStore((state) => state.serverOffsetMs)
  const { squads, loading: squadsLoading, failed: squadsFailed, retry: retrySquads } = useSquads()
  const scoring = useScoring()
  const [tab, setTab] = useState('score')

  const latestMatch = scoring.data?.match
  useEffect(() => {
    if (latestMatch) setMatch(latestMatch)
  }, [latestMatch, setMatch])

  const backTo = `/scorer/${token}/welcome`

  if (!match || !isScoringOpen(scoringOpensAt, serverOffsetMs)) return <Navigate to={backTo} replace />
  if (squadsLoading || scoring.loading) return <FullPageLoader />
  if (squadsFailed || !squads || scoring.failed || !scoring.data) {
    return (
      <AuthLayout title="Scoring">
        <RetryPanel
          message="Couldn't load the match."
          onRetry={() => {
            retrySquads()
            scoring.retry()
          }}
        />
      </AuthLayout>
    )
  }
  if (!isMatchReady(match, squads)) return <Navigate to={backTo} replace />

  const { data } = scoring
  const { current } = data
  const inningsOver = current?.status === 'completed'
  const matchOver = inningsOver && data.nextInnings === null
  const needsSetup = !current || (inningsOver && data.nextInnings !== null)

  const content = needsSetup ? (
    <InningsSetup data={data} busy={scoring.busy} onStart={scoring.start} onUndo={scoring.undo} />
  ) : matchOver ? (
    <MatchResultCard data={data} onBack={() => navigate(backTo)} />
  ) : (
    <ScoringScreen scoring={scoring} />
  )

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gray-50">
      <header className="shrink-0 border-b border-gray-200 bg-white shadow-[inset_0_2px_0_0_#a6192e]">
        <div className="mx-auto flex h-11 max-w-5xl items-center justify-between gap-2 px-3">
          <Link to={backTo} className="shrink-0 text-sm font-medium text-gray-500 transition hover:text-red-600">
            ← Back
          </Link>
          <p className="min-w-0 truncate text-sm font-black text-gray-900">
            {match.teamA.name} <span className="text-red-600">vs</span> {match.teamB.name}
          </p>
          {current ? (
            <div className="flex shrink-0 rounded-full border border-gray-300 bg-white p-0.5">
              <button type="button" className={tabClass(tab === 'score')} onClick={() => setTab('score')}>
                Score
              </button>
              <button type="button" className={tabClass(tab === 'scorecard')} onClick={() => setTab('scorecard')}>
                Card
              </button>
            </div>
          ) : (
            <span className="w-14 shrink-0" aria-hidden="true" />
          )}
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="mx-auto flex h-full w-full max-w-xl flex-col landscape:max-w-5xl lg:max-w-5xl">
          {tab === 'scorecard' && current ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
              <ScorecardPanel matchId={match.id} refreshKey={current.version} />
            </section>
          ) : (
            content
          )}
        </div>
      </main>
    </div>
  )
}

export default ScorerScoringPage
