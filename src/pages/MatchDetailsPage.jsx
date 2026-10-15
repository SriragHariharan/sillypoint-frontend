import { Calendar, MapPin, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import RescheduleMatchModal from '../components/RescheduleMatchModal'
import Skeleton from '../components/Skeleton'
import { getErrorMessage } from '../lib/api'
import { formatMatchDateTime } from '../lib/formatDate'
import { fetchMatchDetails, rescheduleMatch } from '../lib/matchApi'
import { matchStageLabel } from '../lib/matchStages'
import { notifyError, notifyInfo } from '../lib/notify'
import { useAuthStore } from '../store/authStore'

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

function TeamSide({ team }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
      <Avatar src={team.logo} name={team.name} size="lg" rounded="rounded-2xl" />
      <span className="w-full break-words text-base font-extrabold text-gray-900 sm:text-lg">{team.name}</span>
    </div>
  )
}

function MatchDetailsSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto max-w-3xl px-5 pb-16 pt-5 sm:px-6 sm:pt-8">
      <span className="sr-only">Loading match…</span>
      <Skeleton className="h-4 w-40 rounded" />
      <Skeleton className="mt-6 h-72 rounded-2xl" />
    </div>
  )
}

function MatchDetailsPage() {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, match: null, failed: false })
  const [rescheduling, setRescheduling] = useState(false)
  const [saving, setSaving] = useState(false)
  const [openedAt] = useState(() => Date.now())

  const key = `${id}|${reloadKey}`
  const loading = loaded.key !== key

  useEffect(() => {
    const controller = new AbortController()

    fetchMatchDetails(id, controller.signal)
      .then((match) => setLoaded({ key, match, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        if (error.response?.status === 404) {
          setLoaded({ key, match: null, failed: false })
          return
        }
        notifyError(getErrorMessage(error))
        setLoaded({ key, match: null, failed: true })
      })

    return () => controller.abort()
  }, [id, key])

  const onReschedule = async (values) => {
    setSaving(true)
    try {
      const updated = await rescheduleMatch(id, values)
      setLoaded((current) => ({ ...current, match: updated }))
      setRescheduling(false)
      notifyInfo('Match rescheduled.')
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageShell>
        <MatchDetailsSkeleton />
      </PageShell>
    )
  }

  if (loaded.failed) {
    return (
      <PageShell>
        <main className="mx-auto max-w-md px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Couldn&apos;t load this match</h1>
          <p className="mt-2 text-sm text-gray-600">Check your connection and try again.</p>
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </main>
      </PageShell>
    )
  }

  const { match } = loaded

  if (!match) {
    return (
      <PageShell>
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
      </PageShell>
    )
  }

  const { tournament } = match
  const stage = matchStageLabel(match.stage)
  const open = tournament.status === 'upcoming' || tournament.status === 'live'
  const notStarted = new Date(match.scheduledAt).getTime() > openedAt
  const canReschedule = Boolean(user) && user.id === tournament.organizerId && open && notStarted

  return (
    <PageShell>
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
              <TeamSide team={match.teamA} />
              <span className="mt-6 shrink-0 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold tracking-wider text-white">
                VS
              </span>
              <TeamSide team={match.teamB} />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <dl className="grid gap-3 sm:grid-cols-2 sm:gap-8">
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
            </dl>

            {canReschedule && (
              <button
                type="button"
                onClick={() => setRescheduling(true)}
                className="shrink-0 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
              >
                Reschedule match
              </button>
            )}
          </div>
        </section>

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
          submitting={saving}
          onClose={() => setRescheduling(false)}
          onSubmit={onReschedule}
        />
      )}
    </PageShell>
  )
}

export default MatchDetailsPage
