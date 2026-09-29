import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import FilterChips from '../components/FilterChips'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import { formatDate, formatDateRange } from '../lib/formatDate'
import { notifyInfo } from '../lib/notify'
import { fetchTournamentDetails } from '../lib/tournamentApi'
import { useAuthStore } from '../store/authStore'

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'teams', label: 'Teams' },
  { value: 'matches', label: 'Matches' },
]

const MATCH_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
]

const addTeamClass =
  'rounded-full bg-red-600 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-red-700'

function TournamentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const authenticated = useAuthStore((state) => state.status === 'authenticated')
  const [loaded, setLoaded] = useState({ id: null, tournament: null })

  const tab = TABS.some((item) => item.value === params.get('tab')) ? params.get('tab') : 'overview'
  const teamQuery = params.get('team') ?? ''
  const matchStatus = params.get('match') ?? 'all'

  useEffect(() => {
    let active = true
    fetchTournamentDetails(id).then((tournament) => active && setLoaded({ id, tournament }))
    return () => {
      active = false
    }
  }, [id])

  const loading = loaded.id !== id
  const tournament = loading ? null : loaded.tournament

  const setParam = (key, value, fallback = '') => {
    const next = new URLSearchParams(params)
    if (value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const teams = useMemo(() => {
    const term = teamQuery.trim().toLowerCase()
    return (tournament?.teams ?? []).filter(
      (team) =>
        !term || team.name.toLowerCase().includes(term) || team.city.toLowerCase().includes(term),
    )
  }, [tournament, teamQuery])

  const matches = useMemo(
    () =>
      (tournament?.matches ?? []).filter(
        (match) => matchStatus === 'all' || match.status === matchStatus,
      ),
    [tournament, matchStatus],
  )

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
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="px-5 py-16 text-center text-sm text-gray-600">Loading…</p>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
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
      </div>
    )
  }

  const { organizer } = tournament
  const info = [
    { label: 'Location', value: tournament.location },
    { label: 'Dates', value: formatDateRange(tournament.startDate, tournament.endDate) },
    { label: 'Format', value: tournament.format },
    { label: 'Teams', value: `${tournament.teamsCount} registered` },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

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
            <dl className="grid grid-cols-2 gap-3">
              {info.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl bg-gray-50 p-3.5 ${item.label === 'Location' || item.label === 'Dates' ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div
              role="tablist"
              aria-label="Tournament sections"
              className="mt-6 flex border-b border-gray-200"
            >
              {TABS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.value}
                  onClick={() => setParam('tab', item.value, 'overview')}
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
              {tab === 'overview' && (
                <div
                  className="text-sm leading-relaxed text-gray-700 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: tournament.description }}
                />
              )}

              {tab === 'teams' && (
                <div className="space-y-4">
                  <input
                    type="search"
                    value={teamQuery}
                    onChange={(event) => setParam('team', event.target.value)}
                    placeholder="Search teams or cities"
                    aria-label="Search teams"
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  />
                  {teams.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-600">
                      No teams found.
                    </p>
                  ) : (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {teams.map((team) => (
                        <li
                          key={team.id}
                          className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                        >
                          <Avatar name={team.name} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">{team.name}</p>
                            <p className="text-xs text-gray-500">{team.city}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {tab === 'matches' && (
                <div className="space-y-4">
                  <FilterChips
                    label="Filter matches by status"
                    options={MATCH_FILTERS}
                    value={matchStatus}
                    onChange={(value) => setParam('match', value, 'all')}
                  />
                  {matches.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-600">
                      {tournament.matches.length === 0
                        ? 'Fixtures will be published once registration closes.'
                        : 'No matches for this filter.'}
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {matches.map((match) => (
                        <li key={match.id} className="rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <StatusBadge status={match.status} />
                            <span className="text-xs text-gray-500">
                              {formatDate(match.date)} · {match.venue}
                            </span>
                          </div>
                          <p className="mt-3 text-sm font-bold text-gray-900">
                            {match.teamA} <span className="font-medium text-gray-400">vs</span> {match.teamB}
                          </p>
                          {match.result && <p className="mt-1 text-sm text-gray-600">{match.result}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Organizer</h2>
              <div className="mt-3 flex items-center gap-3">
                <Avatar src={organizer.photo} name={organizer.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900">{organizer.name}</p>
                  <a
                    href={`tel:+91${organizer.mobile}`}
                    className="text-sm font-medium text-red-600 transition hover:text-red-700"
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

      <Footer />
    </div>
  )
}

export default TournamentDetailsPage
