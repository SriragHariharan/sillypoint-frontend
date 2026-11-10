import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import Avatar from '../components/Avatar'
import FilterChips from '../components/FilterChips'
import Skeleton from '../components/Skeleton'
import TeamMatchCard from '../components/TeamMatchCard'
import TeamSummary from '../components/TeamSummary'
import { useTeamMatches } from '../hooks/useTeamMatches'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const emptyBoxClass = 'mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center'

function TeamDetailsPage() {
  const { id } = useParams()
  const history = useTeamMatches(id)
  const teamId = Number(id)
  const [openedAt] = useState(() => Date.now())
  const { team } = history

  if (history.notFound) {
    return (
      <div className="min-h-screen bg-white pb-16 text-gray-900 sm:pb-0">
        <AppNavbar />
        <main className="mx-auto max-w-md px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold">Team not found</h1>
          <p className="mt-2 text-sm text-gray-600">It may have been removed, or it is not one of your teams.</p>
          <Link to="/teams" className="mt-6 inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
            Back to my teams
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-16 text-gray-900 sm:pb-0">
      <AppNavbar />

      <main className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <Link to="/teams" className="text-sm font-medium text-gray-500 transition hover:text-red-600">
          ← My teams
        </Link>

        <section className="mt-4 flex items-center gap-4">
          {history.teamLoading ? (
            <Skeleton className="h-14 w-14 rounded-xl" />
          ) : (
            <Avatar src={team?.logo} name={team?.name} rounded="rounded-xl" />
          )}
          <div className="min-w-0 flex-1">
            {history.teamLoading ? (
              <Skeleton className="h-7 w-40 rounded" />
            ) : (
              <>
                <h1 className="truncate text-2xl font-extrabold tracking-tight">{team?.name}</h1>
                <p className="mt-0.5 truncate text-sm text-gray-600">
                  Captain {team?.captain_name} · +91 {team?.captain_mobile}
                </p>
              </>
            )}
          </div>
          {team && (
            <Link
              to={`/teams/${team.id}/edit`}
              className="shrink-0 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
            >
              Edit
            </Link>
          )}
        </section>

        <TeamSummary summary={history.summary} />

        <h2 className="mt-8 text-lg font-bold">Match history</h2>
        <div className="mt-3">
          <FilterChips label="Filter matches" options={STATUS_OPTIONS} value={history.status} onChange={history.setStatus} />
        </div>

        {history.loading ? (
          <ul aria-busy="true" className="mt-4 space-y-3">
            <span className="sr-only">Loading matches…</span>
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-2xl" />
            ))}
          </ul>
        ) : history.failed ? (
          <div className={emptyBoxClass}>
            <p className="font-semibold text-gray-900">Couldn&apos;t load the matches</p>
            <button type="button" onClick={history.retry} className="mt-4 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">
              Retry
            </button>
          </div>
        ) : history.matches.length === 0 ? (
          <div className={emptyBoxClass}>
            <p className="font-semibold text-gray-900">
              {history.status === 'all' ? 'No matches yet' : 'No matches match this filter'}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {history.status === 'all'
                ? 'Matches show up here once an organizer schedules them for this team.'
                : 'Try a different filter.'}
            </p>
          </div>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {history.matches.map((match) => (
                <TeamMatchCard key={match.id} match={match} teamId={teamId} now={openedAt} />
              ))}
            </ul>
            {history.hasMore && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={history.loadMore}
                  disabled={history.loadingMore}
                  className="rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {history.loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default TeamDetailsPage
