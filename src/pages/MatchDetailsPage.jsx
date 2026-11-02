import { Calendar, MapPin, Trophy, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AddScorerModal from '../components/AddScorerModal'
import MatchDetailsSkeleton from '../components/MatchDetailsSkeleton'
import MatchTeamSide from '../components/MatchTeamSide'
import RescheduleMatchModal from '../components/RescheduleMatchModal'
import ScorerAccessCard from '../components/ScorerAccessCard'
import TournamentPageShell from '../components/TournamentPageShell'
import { useMatchDetails } from '../hooks/useMatchDetails'
import { formatMatchDateTime } from '../lib/formatDate'
import { matchStageLabel } from '../lib/matchStages'
import { useAuthStore } from '../store/authStore'

const actionClass =
  'rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600'

function MatchDetailsPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const details = useMatchDetails(id)
  const [rescheduling, setRescheduling] = useState(false)
  const [addingScorer, setAddingScorer] = useState(false)
  const [openedAt] = useState(() => Date.now())

  const onReschedule = async (values) => {
    if (await details.reschedule(values)) setRescheduling(false)
  }

  const onAddScorer = async (values) => {
    if (await details.addScorer(values)) setAddingScorer(false)
  }

  if (details.loading) {
    return (
      <TournamentPageShell>
        <MatchDetailsSkeleton />
      </TournamentPageShell>
    )
  }

  if (details.failed) {
    return (
      <TournamentPageShell>
        <main className="mx-auto max-w-md px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Couldn&apos;t load this match</h1>
          <p className="mt-2 text-sm text-gray-600">Check your connection and try again.</p>
          <button
            type="button"
            onClick={details.retry}
            className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </main>
      </TournamentPageShell>
    )
  }

  const { match } = details

  if (!match) {
    return (
      <TournamentPageShell>
        <main className="mx-auto max-w-md px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Match not found</h1>
          <p className="mt-2 text-sm text-gray-600">It may have been removed or the link is wrong.</p>
          <Link
            to="/tournaments"
            className="mt-6 inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Browse tournaments
          </Link>
        </main>
      </TournamentPageShell>
    )
  }

  const { tournament } = match
  const stage = matchStageLabel(match.stage)
  const open = tournament.status === 'upcoming' || tournament.status === 'live'
  const isOrganizer = Boolean(user) && user.id === tournament.organizerId
  const notStarted = new Date(match.scheduledAt).getTime() > openedAt
  const canReschedule = isOrganizer && open && notStarted
  const canAddScorer = isOrganizer && open && !match.scorerName

  return (
    <TournamentPageShell>
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-5 sm:px-6 sm:pt-8">
        <Link
          to={`/tournaments/${tournament.id}?tab=matches`}
          className="text-sm font-medium text-gray-500 transition hover:text-red-600"
        >
          ← All matches
        </Link>

        <section className="mt-5 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6">
            <Link
              to={`/tournaments/${tournament.id}`}
              className="flex min-w-0 items-center gap-2 text-sm font-bold text-gray-900 transition hover:text-red-600"
            >
              <Trophy className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
              <span className="truncate">{tournament.name}</span>
            </Link>
            {stage && (
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                {stage}
              </span>
            )}
          </div>

          <div className="px-4 py-6 sm:px-8 sm:py-8">
            <div className="flex items-start gap-3 sm:gap-6">
              <MatchTeamSide team={match.teamA} />
              <span className="mt-6 shrink-0 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold tracking-wider text-white">
                VS
              </span>
              <MatchTeamSide team={match.teamB} />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <dl className="grid gap-3 sm:grid-cols-2 sm:gap-x-8">
              <div className="flex items-start gap-2.5">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Date &amp; time</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-gray-900">
                    {formatMatchDateTime(match.scheduledAt)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Location</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-gray-900">{tournament.location}</dd>
                </div>
              </div>
              {match.scorerName && (
                <div className="flex items-start gap-2.5">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Scorer</dt>
                    <dd className="mt-0.5 break-words text-sm font-semibold text-gray-900">{match.scorerName}</dd>
                  </div>
                </div>
              )}
            </dl>

            {(canReschedule || canAddScorer) && (
              <div className="flex shrink-0 flex-col gap-2">
                {canAddScorer && (
                  <button type="button" onClick={() => setAddingScorer(true)} className={actionClass}>
                    Add scorer
                  </button>
                )}
                {canReschedule && (
                  <button type="button" onClick={() => setRescheduling(true)} className={actionClass}>
                    Reschedule match
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {isOrganizer && match.scorerName && <ScorerAccessCard matchId={match.id} scorerName={match.scorerName} />}

        {match.notes && (
          <section className="mt-4 rounded-2xl bg-gray-50 p-4 sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Special notes</h2>
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
      {addingScorer && (
        <AddScorerModal
          match={match}
          submitting={details.saving}
          onClose={() => setAddingScorer(false)}
          onSubmit={onAddScorer}
        />
      )}
    </TournamentPageShell>
  )
}

export default MatchDetailsPage
