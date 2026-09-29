import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FilterChips from '../components/FilterChips'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import TournamentCard from '../components/TournamentCard'
import { fetchTournaments } from '../lib/tournamentApi'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
]

function TournamentsPage() {
  const [params, setParams] = useSearchParams()
  const [tournaments, setTournaments] = useState(null)

  const q = params.get('q') ?? ''
  const status = params.get('status') ?? 'all'

  useEffect(() => {
    let active = true
    fetchTournaments().then((data) => active && setTournaments(data))
    return () => {
      active = false
    }
  }, [])

  const setParam = (key, value, fallback = '') => {
    const next = new URLSearchParams(params)
    if (value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return (tournaments ?? []).filter(
      (item) =>
        (status === 'all' || item.status === status) &&
        (!term ||
          item.name.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term)),
    )
  }, [tournaments, q, status])

  const hasFilters = Boolean(q) || status !== 'all'

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Tournaments</h1>
            <p className="mt-1 text-sm text-gray-600">Browse live, upcoming and past cricket tournaments.</p>
          </div>
          <Link
            to="/tournaments/new"
            className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            + Create
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          <input
            type="search"
            value={q}
            onChange={(event) => setParam('q', event.target.value)}
            placeholder="Search by name or venue"
            aria-label="Search tournaments"
            className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
          />

          <FilterChips
            label="Filter by status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(value) => setParam('status', value, 'all')}
          />
        </div>

        <div className="mt-6 flex items-center justify-between text-sm">
          <p className="text-gray-600" aria-live="polite">
            {tournaments ? `${filtered.length} ${filtered.length === 1 ? 'tournament' : 'tournaments'}` : 'Loading…'}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setParams({}, { replace: true })}
              className="font-semibold text-red-600 transition hover:text-red-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {tournaments && filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
            <p className="font-semibold text-gray-900">No tournaments match your filters</p>
            <p className="mt-1 text-sm text-gray-600">Try a different search or clear the filters.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filtered.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default TournamentsPage
