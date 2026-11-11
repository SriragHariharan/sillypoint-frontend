import { ArrowLeft, CalendarX } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import FilterChips from '../components/FilterChips'
import NotFoundScreen from '../components/NotFoundScreen'
import RetryPanel from '../components/RetryPanel'
import Skeleton from '../components/Skeleton'
import TeamMatchCard from '../components/TeamMatchCard'
import TeamSummary from '../components/TeamSummary'
import { useTeamMatches } from '../hooks/useTeamMatches'
import { cardClass, compactSecondaryButtonClass, headingClass, secondaryButtonClass } from '../lib/premiumStyles'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

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
        <NotFoundScreen
          title="Team not found"
          message="It may have been removed, or it is not one of your teams."
          to="/teams"
          label="Back to my teams"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-16 text-gray-900 sm:pb-0">
      <AppNavbar />

      <main className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div>
          <Link
            to="/teams"
            className="-ml-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            My teams
          </Link>

          <section className={`${cardClass} mt-3 flex items-center gap-4 p-4 sm:p-5`}>
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
                  <h1 className={`truncate text-2xl ${headingClass}`}>{team?.name}</h1>
                  <p className="mt-0.5 truncate text-sm text-gray-600">
                    Captain {team?.captain_name} · +91 {team?.captain_mobile}
                  </p>
                </>
              )}
            </div>
            {team && (
              <Link to={`/teams/${team.id}/edit`} className={`shrink-0 ${compactSecondaryButtonClass}`}>
                Edit
              </Link>
            )}
          </section>
        </div>

        <TeamSummary summary={history.summary} />

        <h2 className="mt-8 text-lg font-black tracking-tight">Match history</h2>
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
          <div className="mt-6">
            <RetryPanel message="Couldn't load the matches" onRetry={history.retry} />
          </div>
        ) : history.matches.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={CalendarX}
              title={history.status === 'all' ? 'No matches yet' : 'No matches match this filter'}
            >
              {history.status === 'all'
                ? 'Matches show up here once an organizer schedules them for this team.'
                : 'Try a different filter.'}
            </EmptyState>
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
                  className={`px-8 ${secondaryButtonClass}`}
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
