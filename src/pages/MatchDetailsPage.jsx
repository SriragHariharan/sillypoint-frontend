import { ArrowLeft, Calendar, MapPin, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadErrorScreen from '../components/LoadErrorScreen'
import MatchDetailsSkeleton from '../components/MatchDetailsSkeleton'
import MatchScorecardSection from '../components/MatchScorecardSection'
import MatchTeamSide from '../components/MatchTeamSide'
import NotFoundScreen from '../components/NotFoundScreen'
import RescheduleMatchModal from '../components/RescheduleMatchModal'
import RingsBackdrop from '../components/RingsBackdrop'
import ScorerAccessCard from '../components/ScorerAccessCard'
import TournamentPageShell from '../components/TournamentPageShell'
import { useMatchDetails } from '../hooks/useMatchDetails'
import { formatMatchDateTime } from '../lib/formatDate'
import { isMatchCompleted } from '../lib/matchResult'
import { matchStageLabel } from '../lib/matchStages'
import { useAuthStore } from '../store/authStore'

function MatchDetailsPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const details = useMatchDetails(id)
  const [rescheduling, setRescheduling] = useState(false)
  const [openedAt] = useState(() => Date.now())

  const onReschedule = async (values) => {
    if (await details.reschedule(values)) setRescheduling(false)
  }

  if (details.loading) {
    return (
      <TournamentPageShell bottomTabs>
        <MatchDetailsSkeleton />
      </TournamentPageShell>
    )
  }

  if (details.failed) {
    return (
      <TournamentPageShell bottomTabs>
        <LoadErrorScreen title="Couldn't load this match" onRetry={details.retry} />
      </TournamentPageShell>
    )
  }

  const { match } = details

  if (!match) {
    return (
      <TournamentPageShell bottomTabs>
        <NotFoundScreen
          title="Match not found"
          message="It may have been removed or the link is wrong."
          to="/tournaments"
          label="Browse tournaments"
        />
      </TournamentPageShell>
    )
  }

  const { tournament } = match
  const stage = matchStageLabel(match.stage)
  const open = tournament.status === 'upcoming' || tournament.status === 'live'
  const isOrganizer = Boolean(user) && user.id === tournament.organizerId
  const notStarted = new Date(match.scheduledAt).getTime() > openedAt
  const canReschedule =
    isOrganizer && open && notStarted && !match.scoringStartedAt && !isMatchCompleted(match)

  return (
    <TournamentPageShell bottomTabs>
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-5 sm:px-6 sm:pt-8">
        <Link
          to={`/tournaments/${tournament.id}?tab=matches`}
          className="-ml-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          All matches
        </Link>

        <section className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white shadow-2xl shadow-red-600/25 ring-1 ring-white/15">
          <RingsBackdrop className="h-[42rem] w-[42rem]" />

          <div className="relative flex items-center justify-between gap-3 border-b border-white/15 px-4 py-3 sm:px-6">
            <Link
              to={`/tournaments/${tournament.id}`}
              className="flex min-w-0 items-center gap-2 text-sm font-bold text-white transition hover:text-red-100"
            >
              <Trophy className="h-4 w-4 shrink-0 text-red-100" aria-hidden="true" />
              <span className="truncate">{tournament.name}</span>
            </Link>
            {stage && (
              <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                {stage}
              </span>
            )}
          </div>

          <div className="relative px-4 py-6 sm:px-8 sm:py-8">
            <div className="flex items-start gap-3 sm:gap-6">
              <MatchTeamSide team={match.teamA} onDark />
              <span className="mt-6 shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black tracking-wider text-red-700">
                VS
              </span>
              <MatchTeamSide team={match.teamB} onDark />
            </div>
          </div>

          <div className="relative flex flex-col gap-4 border-t border-white/15 bg-red-950/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <dl className="grid gap-3 sm:grid-cols-2 sm:gap-x-8">
              <div className="flex items-start gap-2.5">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-red-100" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-red-100">Date &amp; time</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-white">{formatMatchDateTime(match.scheduledAt)}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-100" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-red-100">Location</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-white">{tournament.location}</dd>
                </div>
              </div>
            </dl>

            {canReschedule && (
              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduling(true)}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-lg shadow-red-950/30 transition hover:bg-red-50"
                >
                  Reschedule match
                </button>
              </div>
            )}
          </div>
        </section>

        <MatchScorecardSection match={match} />

        {isOrganizer && <ScorerAccessCard matchId={match.id} />}

        {match.notes && (
          <section className="mt-4 rounded-2xl border border-red-100 bg-red-50/60 p-4 sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-red-700">Special notes</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">{match.notes}</p>
          </section>
        )}
      </main>

      {rescheduling && (
        <RescheduleMatchModal
          match={match}
          submitting={details.saving}
          onClose={() => setRescheduling(false)}
          onSubmit={onReschedule}
        />
      )}
    </TournamentPageShell>
  )
}

export default MatchDetailsPage
