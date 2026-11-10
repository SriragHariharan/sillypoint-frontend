import FilterChips from './FilterChips'
import TournamentCard from './TournamentCard'
import TournamentCardSkeleton from './TournamentCardSkeleton'

const SKELETON_COUNT = 6

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function TournamentList({ list, emptyTitle, emptyText, emptyAction }) {
  const { loading, failed, items, total, hasFilters, hasMore, loadingMore } = list

  return (
    <>
      <div className="mt-5 space-y-3">
        <input
          type="search"
          value={list.search}
          onChange={(event) => list.setSearch(event.target.value)}
          placeholder="Search by name or venue"
          aria-label="Search tournaments"
          className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
        />

        <FilterChips label="Filter by status" options={STATUS_OPTIONS} value={list.status} onChange={list.setStatus} />
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <p className="text-gray-600" aria-live="polite">
          {loading || failed ? ' ' : `${total} ${total === 1 ? 'tournament' : 'tournaments'}`}
        </p>
        {hasFilters && (
          <button type="button" onClick={list.clearFilters} className="font-semibold text-red-600 transition hover:text-red-700">
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
      ) : failed ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
          <p className="font-semibold text-gray-900">Couldn&apos;t load tournaments</p>
          <p className="mt-1 text-sm text-gray-600">Check your connection and try again.</p>
          <button
            type="button"
            onClick={list.retry}
            className="mt-5 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
          <p className="font-semibold text-gray-900">{hasFilters ? 'No tournaments match your filters' : emptyTitle}</p>
          <p className="mt-1 text-sm text-gray-600">
            {hasFilters ? 'Try a different search or clear the filters.' : emptyText}
          </p>
          {!hasFilters && emptyAction}
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {items.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
            {loadingMore && Array.from({ length: 3 }, (_, index) => <TournamentCardSkeleton key={`more-${index}`} />)}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={list.loadMore}
                disabled={loadingMore}
                className="rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default TournamentList
