import { Search, SearchX, Trophy } from 'lucide-react'
import { fieldGroupClass } from '../lib/formStyles'
import { secondaryButtonClass } from '../lib/premiumStyles'
import EmptyState from './EmptyState'
import FilterChips from './FilterChips'
import RetryPanel from './RetryPanel'
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
        <div className={fieldGroupClass(false)}>
          <Search className="ml-3 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            value={list.search}
            onChange={(event) => list.setSearch(event.target.value)}
            placeholder="Search by name or venue"
            aria-label="Search tournaments"
            className="w-full bg-transparent px-3 py-3 text-sm text-gray-900 outline-none"
          />
        </div>

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
        <div className="mt-6">
          <RetryPanel message="Couldn't load tournaments" onRetry={list.retry} />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={hasFilters ? SearchX : Trophy}
            title={hasFilters ? 'No tournaments match your filters' : emptyTitle}
            action={hasFilters ? undefined : emptyAction}
          >
            {hasFilters ? 'Try a different search or clear the filters.' : emptyText}
          </EmptyState>
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
                className={`px-8 ${secondaryButtonClass}`}
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
