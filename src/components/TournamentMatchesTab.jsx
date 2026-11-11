import { CalendarX, Plus } from 'lucide-react'
import { primaryButtonClass } from '../lib/premiumStyles'
import EmptyState from './EmptyState'
import LoadingCards from './LoadingCards'
import MatchCard from './MatchCard'
import RetryPanel from './RetryPanel'

function MatchList({ matches, loading, failed, onRetry, canAddMatch }) {
  if (loading) return <LoadingCards label="Loading matches…" />
  if (failed) return <RetryPanel message="Couldn't load matches" onRetry={onRetry} />
  if (matches.length === 0) {
    return (
      <EmptyState icon={CalendarX} title="No matches yet">
        {canAddMatch ? 'No matches scheduled yet. Add the first one.' : 'No matches have been scheduled yet.'}
      </EmptyState>
    )
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </ul>
  )
}

function TournamentMatchesTab({ canAddMatch, onAddMatch, ...listProps }) {
  return (
    <div>
      {canAddMatch && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onAddMatch}
            className={`inline-flex items-center gap-2 px-5 ${primaryButtonClass}`}
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
            Add Match
          </button>
        </div>
      )}
      <MatchList canAddMatch={canAddMatch} {...listProps} />
    </div>
  )
}

export default TournamentMatchesTab
