import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import TeamCard from '../components/TeamCard'
import TeamCardSkeleton from '../components/TeamCardSkeleton'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">My teams</h1>
            <p className="mt-1 text-sm text-gray-600">Teams you manage.</p>
          </div>
          <Link
            to="/teams/new"
            className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            + Add Team
          </Link>
        </div>

        {loading ? (
          <div aria-busy="true" className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <span className="sr-only">Loading teams…</span>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <TeamCardSkeleton key={index} />
            ))}
          </div>
        ) : result.failed ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
            <p className="font-semibold text-gray-900">Couldn&apos;t load teams</p>
            <p className="mt-1 text-sm text-gray-600">Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="mt-5 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : result.teams.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
            <p className="font-semibold text-gray-900">No teams yet</p>
            <p className="mt-1 text-sm text-gray-600">Add your first team to get started.</p>
            <Link
              to="/teams/new"
              className="mt-5 inline-block rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Add Team
            </Link>
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
