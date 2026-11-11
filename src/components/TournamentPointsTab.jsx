import { Info, ListOrdered } from 'lucide-react'
import { useTournamentStandings } from '../hooks/useTournamentStandings'
import { infoNoteClass } from '../lib/premiumStyles'
import EmptyState from './EmptyState'
import LoadingCards from './LoadingCards'
import PointsTable from './PointsTable'
import RetryPanel from './RetryPanel'

const legendOf = ({ win, tie, loss }) => `Win ${win} · Tie / No result ${tie} · Loss ${loss} · League matches only`

// The tournament's points table, loaded when the tab opens
function TournamentPointsTab({ tournamentId }) {
  const { standings, loading, failed, reload } = useTournamentStandings(tournamentId)

  if (loading) return <LoadingCards label="Loading points table…" />
  if (failed || !standings) return <RetryPanel message="Couldn't load the points table" onRetry={reload} />
  if (standings.rows.length === 0) {
    return (
      <EmptyState icon={ListOrdered} title="No teams yet">
        The points table appears once teams join the tournament.
      </EmptyState>
    )
  }

  return (
    <div className="space-y-3">
      {standings.countedMatches === 0 && (
        <p className={`${infoNoteClass} flex items-start gap-2 text-sm text-gray-700`}>
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          Points appear here once league matches are completed.
        </p>
      )}
      <PointsTable rows={standings.rows} />
      <p className="px-1 text-xs text-gray-500">
        {legendOf(standings.pointsSystem)}. Ties on points are split by net run rate (NRR).
      </p>
    </div>
  )
}

export default TournamentPointsTab
