import EmptyNote from './EmptyNote'
import LoadingCards from './LoadingCards'
import MatchCard from './MatchCard'
import RetryPanel from './RetryPanel'

function MatchList({ matches, loading, failed, onRetry, canAddMatch }) {
  if (loading) return <LoadingCards label="Loading matches…" />
  if (failed) return <RetryPanel message="Couldn't load matches" onRetry={onRetry} />
  if (matches.length === 0) {
    return (
      <EmptyNote>
        {canAddMatch ? 'No matches scheduled yet. Add the first one.' : 'No matches have been scheduled yet.'}
      </EmptyNote>
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
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Add Match
          </button>
        </div>
      )}
      <MatchList canAddMatch={canAddMatch} {...listProps} />
    </div>
  )
}

export default TournamentMatchesTab
