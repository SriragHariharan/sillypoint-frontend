import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import TournamentDetailsSkeleton from '../components/TournamentDetailsSkeleton'
import { getErrorMessage } from '../lib/api'
import { formatDateRange } from '../lib/formatDate'
import { notifyError, notifyInfo } from '../lib/notify'
import { fetchTournamentDetails } from '../lib/tournamentApi'
import { useAuthStore } from '../store/authStore'

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'teams', label: 'Teams' },
  { value: 'matches', label: 'Matches' },
]

const EMPTY_TEXT = {
  teams: 'Teams will appear here once registration opens.',
  matches: 'Fixtures will be published later.',
}

const addTeamClass =
  'rounded-full bg-red-600 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-red-700'

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

function TournamentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const authenticated = useAuthStore((state) => state.status === 'authenticated')
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState({ key: null, tournament: null, failed: false })

  const tab = TABS.some((item) => item.value === params.get('tab')) ? params.get('tab') : 'overview'

  const key = `${id}|${reloadKey}`
  const loading = loaded.key !== key

  useEffect(() => {
    const controller = new AbortController()

    fetchTournamentDetails(id, controller.signal)
      .then((tournament) => setLoaded({ key, tournament, failed: false }))
      .catch((error) => {
        if (error?.code === 'ERR_CANCELED') return
        if (error.response?.status === 404) {
          setLoaded({ key, tournament: null, failed: false })
          return
        }
        notifyError(getErrorMessage(error))
        setLoaded({ key, tournament: null, failed: true })
      })

    return () => controller.abort()
  }, [id, key])

  const setTab = (value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === 'overview') next.delete('tab')
        else next.set('tab', value)
        return next
      },
      { replace: true },
    )
  }

  const onAddTeam = () => {
    if (!authenticated) {
      notifyInfo('Log in to add your team to this tournament.')
      navigate('/login')
      return
    }
    notifyInfo('Team registration is coming soon.')
  }

  if (loading) {
    return (
      <PageShell>
        <TournamentDetailsSkeleton />
      </PageShell>
    )
  }

  if (loaded.failed) {
    return (
      <PageShell>
        <main className="mx-auto max-w-md px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Couldn&apos;t load this tournament</h1>
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

  const { tournament } = loaded

  if (!tournament) {
    return (
      <PageShell>
        <main className="mx-auto max-w-md px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Tournament not found</h1>
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

  const { organizer } = tournament
  const info = [
    { label: 'Location', value: tournament.location },
    { label: 'Dates', value: formatDateRange(tournament.startDate, tournament.endDate) },
  ]

  return (
    <PageShell>
      <main className="mx-auto max-w-6xl px-5 pb-32 pt-5 sm:px-6 sm:pb-16 sm:pt-8">
        <Link to="/tournaments" className="text-sm font-medium text-gray-500 transition hover:text-red-600">
          ← All tournaments
        </Link>

        <header className="mt-4 flex items-start gap-4">
          <Avatar src={tournament.logo} name={tournament.name} size="lg" rounded="rounded-2xl" />
          <div className="min-w-0 flex-1">
            <StatusBadge status={tournament.status} />
            <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {tournament.name}
            </h1>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {info.map((item) => (
                <div key={item.label} className="rounded-xl bg-gray-50 p-3.5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div role="tablist" aria-label="Tournament sections" className="mt-6 flex border-b border-gray-200">
              {TABS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.value}
                  onClick={() => setTab(item.value)}
                  className={`flex-1 border-b-2 px-3 py-3 text-sm font-semibold transition sm:flex-none sm:px-6 ${
                    tab === item.value
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-5" role="tabpanel">
              {tab === 'overview' ? (
                tournament.description ? (
                  <div
                    className="text-sm leading-relaxed text-gray-700 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: tournament.description }}
                  />
                ) : (
                  <p className="text-sm text-gray-600">The organizer hasn&apos;t added a description yet.</p>
                )
              ) : (
                <p className="rounded-2xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-600">
                  {EMPTY_TEXT[tab]}
                </p>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Organizer</h2>
              <div className="mt-3 flex items-center gap-3">
                <Avatar src={organizer.avatar} size="md" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Contact</p>
                  <a
                    href={`tel:+91${organizer.mobile}`}
                    className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                  >
                    +91 {organizer.mobile}
                  </a>
                </div>
              </div>
            </section>

            <button type="button" onClick={onAddTeam} className={`${addTeamClass} mt-4 hidden w-full sm:block`}>
              Add my team
            </button>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-5 py-3 backdrop-blur sm:hidden">
        <button type="button" onClick={onAddTeam} className={`${addTeamClass} w-full`}>
          Add my team
        </button>
      </div>
    </PageShell>
  )
}

export default TournamentDetailsPage
