import { ArrowLeft, Calendar, MapPin, Trophy } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import LoadErrorScreen from '../components/LoadErrorScreen'
import MatchDetailsSkeleton from '../components/MatchDetailsSkeleton'
import MatchScorecardSection from '../components/MatchScorecardSection'
import MatchTeamSide from '../components/MatchTeamSide'
import NotFoundScreen from '../components/NotFoundScreen'
import RingsBackdrop from '../components/RingsBackdrop'
import ScorerAccessCard from '../components/ScorerAccessCard'
import TournamentPageShell from '../components/TournamentPageShell'
import MatchStatusBand from '../components/MatchStatusBand'
import { useMatchDetails } from '../hooks/useMatchDetails'
import { useScorecard } from '../hooks/useScorecard'
import { formatMatchDateTime } from '../lib/formatDate'
import { inningsOfTeam, isMatchCompleted, isMatchLive, liveLine, superOverOfTeam, winnerOf } from '../lib/matchResult'
import { matchStageLabel } from '../lib/matchStages'
import { useAuthStore } from '../store/authStore'

function MatchDetailsPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const details = useMatchDetails(id)
  // One fetch feeds the top card and the scorecards below; polls itself while the match is live
  const scorecardState = useScorecard(details.match?.id, 0, {
    live: isMatchLive(details.match),
    enabled: Boolean(details.match?.scoringStartedAt),
  })

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
  const isOrganizer = Boolean(user) && user.id === tournament.organizerId

  // The scorecard's copy of the match is the freshest (result and winner appear the moment the match ends)
  const { scorecard, loading: scoresLoading } = scorecardState
  const state = scorecard?.match ?? match
  const started = Boolean(state.scoringStartedAt)
  const winner = winnerOf(state)
  const sideProps = (team) => {
    const innings = inningsOfTeam(scorecard, team.id)
    return {
      team,
      onDark: true,
      innings,
      superOver: superOverOfTeam(scorecard, team.id),
      scoreLoading: started && scoresLoading,
      yetToBat: started && scorecard !== null && !innings,
      winner: winner?.id === team.id,
      dim: Boolean(winner) && winner.id !== team.id,
    }
  }

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
              <MatchTeamSide {...sideProps(match.teamA)} />
              <span className="mt-6 shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black tracking-wider text-red-700">
                VS
              </span>
              <MatchTeamSide {...sideProps(match.teamB)} />
            </div>
          </div>

          <MatchStatusBand
            live={isMatchLive(state)}
            completed={isMatchCompleted(state)}
            resultSummary={state.resultSummary}
            liveText={liveLine(scorecard)}
          />

          <div className="relative border-t border-white/15 bg-red-950/30 px-4 py-4 sm:px-6">
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
          </div>
        </section>

        <MatchScorecardSection match={match} state={scorecardState} />

        {isOrganizer && <ScorerAccessCard matchId={match.id} />}

        {match.notes && (
          <section className="mt-4 rounded-2xl border border-red-100 bg-red-50/60 p-4 sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-red-700">Special notes</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">{match.notes}</p>
          </section>
        )}
      </main>
    </TournamentPageShell>
  )
}

export default MatchDetailsPage
