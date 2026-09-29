import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FilterChips from '../components/FilterChips'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import TournamentCard from '../components/TournamentCard'
import TournamentCardSkeleton from '../components/TournamentCardSkeleton'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { fetchTournaments } from '../lib/tournamentApi'

const PAGE_SIZE = 12
const SKELETON_COUNT = 6
const SEARCH_DEBOUNCE_MS = 300

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const isCanceled = (error) => error?.code === 'ERR_CANCELED'

function TournamentsPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const status = params.get('status') ?? 'all'

  const [search, setSearch] = useState(q)
  const [reloadKey, setReloadKey] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [result, setResult] = useState({ key: null, items: [], total: 0, page: 1, failed: false })

  const key = `${q}|${status}|${reloadKey}`
  const loading = result.key !== key

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams(
        (prev) => {
          if ((prev.get('q') ?? '') === search.trim()) return prev
          const next = new URLSearchParams(prev)
          if (search.trim()) next.set('q', search.trim())
          else next.delete('q')
          return next
        },
        { replace: true },
      )
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [search, setParams])

  useEffect(() => {
    const controller = new AbortController()
    const query = { page: 1, limit: PAGE_SIZE }
    if (q) query.q = q
    if (status !== 'all') query.status = status

    fetchTournaments(query, controller.signal)
      .then((data) => {
        setResult({ key, items: data.tournaments, total: data.total, page: data.page, failed: false })
      })
      .catch((error) => {
        if (isCanceled(error)) return
        notifyError(getErrorMessage(error))
        setResult({ key, items: [], total: 0, page: 1, failed: true })
      })

    return () => controller.abort()
  }, [key, q, status])

  const setStatus = (value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === 'all') next.delete('status')
        else next.set('status', value)
        return next
      },
      { replace: true },
    )
  }

  const clearFilters = () => {
    setSearch('')
    setParams({}, { replace: true })
  }

  const loadMore = async () => {
    setLoadingMore(true)
    const query = { page: result.page + 1, limit: PAGE_SIZE }
    if (q) query.q = q
    if (status !== 'all') query.status = status

    try {
      const data = await fetchTournaments(query)
      setResult((prev) =>
        prev.key === key
          ? { ...prev, items: [...prev.items, ...data.tournaments], total: data.total, page: data.page }
          : prev,
      )
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setLoadingMore(false)
    }
  }

  const hasFilters = Boolean(q) || status !== 'all'
  const hasMore = !loading && result.items.length < result.total

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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or venue"
            aria-label="Search tournaments"
            className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
          />

          <FilterChips
            label="Filter by status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
          />
        </div>

        <div className="mt-6 flex items-center justify-between text-sm">
          <p className="text-gray-600" aria-live="polite">
            {loading || result.failed
              ? ' '
              : `${result.total} ${result.total === 1 ? 'tournament' : 'tournaments'}`}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-semibold text-red-600 transition hover:text-red-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div aria-busy="true" className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <span className="sr-only">Loading tournaments…</span>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <TournamentCardSkeleton key={index} />
            ))}
          </div>
        ) : result.failed ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
            <p className="font-semibold text-gray-900">Couldn&apos;t load tournaments</p>
            <p className="mt-1 text-sm text-gray-600">Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="mt-5 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : result.items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
            <p className="font-semibold text-gray-900">
              {hasFilters ? 'No tournaments match your filters' : 'No tournaments yet'}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {hasFilters ? 'Try a different search or clear the filters.' : 'Be the first to create one.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {result.items.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
              {loadingMore &&
                Array.from({ length: 3 }, (_, index) => <TournamentCardSkeleton key={`more-${index}`} />)}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default TournamentsPage
