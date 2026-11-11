import { Users } from 'lucide-react'
import EmptyState from './EmptyState'
import EnrolledTeamCard from './EnrolledTeamCard'
import LoadingCards from './LoadingCards'
import RetryPanel from './RetryPanel'

function TournamentTeamsTab({ teams, loading, failed, onRetry, canRemove, onRemove }) {
  if (loading) return <LoadingCards label="Loading teams…" />
  if (failed) return <RetryPanel message="Couldn't load teams" onRetry={onRetry} />
  if (teams.length === 0) return <EmptyState icon={Users} title="No teams yet">No teams have joined yet.</EmptyState>

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {teams.map((team) => (
        <EnrolledTeamCard key={team.id} team={team} canRemove={canRemove(team)} onRemove={onRemove} />
      ))}
    </ul>
  )
}

export default TournamentTeamsTab
