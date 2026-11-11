import { CalendarClock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTeamUpcoming } from '../hooks/useTeamUpcoming'
import { secondaryButtonClass } from '../lib/premiumStyles'
import EmptyState from './EmptyState'
import RetryPanel from './RetryPanel'
import Skeleton from './Skeleton'
import TeamMatchCard from './TeamMatchCard'

const MINUTE_MS = 60_000

// The team's matches that have not started yet, the next one first, with a countdown kept fresh every minute
function TeamUpcomingSection({ teamId }) {
  const upcoming = useTeamUpcoming(teamId)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), MINUTE_MS)
    return () => clearInterval(id)
  }, [])

  const nextId = upcoming.matches.find((match) => new Date(match.scheduledAt).getTime() > now)?.id

  return (
    <section aria-labelledby="upcoming-heading" className="mt-8">
      <h2 id="upcoming-heading" className="flex items-center gap-2 text-lg font-black tracking-tight">
        Upcoming matches
        {!upcoming.loading && upcoming.total > 0 && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">{upcoming.total}</span>
        )}
      </h2>

      {upcoming.loading ? (
        <ul aria-busy="true" className="mt-4 space-y-3">
          <span className="sr-only">Loading upcoming matches…</span>
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-2xl" />
          ))}
        </ul>
      ) : upcoming.failed ? (
        <div className="mt-4">
          <RetryPanel message="Couldn't load the upcoming matches" onRetry={upcoming.retry} />
        </div>
      ) : upcoming.matches.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={CalendarClock} title="No upcoming matches">
            They show up here once an organizer schedules a match for this team.
          </EmptyState>
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {upcoming.matches.map((match) => (
              <TeamMatchCard
                key={match.id}
                match={match}
                teamId={teamId}
                now={now}
                countdown
                highlight={match.id === nextId}
              />
            ))}
          </ul>
          {upcoming.hasMore && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={upcoming.loadMore}
                disabled={upcoming.loadingMore}
                className={`px-8 ${secondaryButtonClass}`}
              >
                {upcoming.loadingMore ? 'Loading…' : 'Show more'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default TeamUpcomingSection
