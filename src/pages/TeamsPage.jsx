import { Plus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import RetryPanel from '../components/RetryPanel'
import TeamCard from '../components/TeamCard'
import TeamCardSkeleton from '../components/TeamCardSkeleton'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { primaryButtonClass } from '../lib/premiumStyles'
import { fetchTeams } from '../lib/teamApi'

const SKELETON_COUNT = 3

const isCanceled = (error) => error?.code === 'ERR_CANCELED'

function TeamsPage() {
  const [reloadKey, setReloadKey] = useState(0)
  const [result, setResult] = useState({ key: null, teams: [], failed: false })

  const loading = result.key !== reloadKey

  useEffect(() => {
    const controller = new AbortController()

    fetchTeams(controller.signal)
      .then((teams) => setResult({ key: reloadKey, teams, failed: false }))
      .catch((error) => {
        if (isCanceled(error)) return
        notifyError(getErrorMessage(error))
        setResult({ key: reloadKey, teams: [], failed: true })
      })

    return () => controller.abort()
  }, [reloadKey])

  return (
    <div className="min-h-screen bg-white pb-16 text-gray-900 sm:pb-0">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <PageHeader
          eyebrow="Your squads"
          title={
            <>
              My <span className="text-red-600">teams</span>
            </>
          }
          subtitle="Teams you manage."
          action={
            <Link to="/teams/new" className={`inline-flex items-center gap-2 px-5 ${primaryButtonClass}`}>
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              Add Team
            </Link>
          }
        />

        {loading ? (
          <div aria-busy="true" className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <span className="sr-only">Loading teams…</span>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <TeamCardSkeleton key={index} />
            ))}
          </div>
        ) : result.failed ? (
          <div className="mt-6">
            <RetryPanel message="Couldn't load teams" onRetry={() => setReloadKey((value) => value + 1)} />
          </div>
        ) : result.teams.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={Users}
              title="No teams yet"
              action={
                <Link to="/teams/new" className={`inline-block px-6 ${primaryButtonClass}`}>
                  Add Team
                </Link>
              }
            >
              Add your first team to get started.
            </EmptyState>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {result.teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default TeamsPage
