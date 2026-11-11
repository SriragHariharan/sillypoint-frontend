import AddTeamButton from './AddTeamButton'
import RegistrationDeadline from './RegistrationDeadline'

function TournamentSidebar({ tournament, onAddTeam, addTeamDisabled }) {
  return (
    <aside className="hidden sm:block lg:sticky lg:top-24 lg:self-start">
      <RegistrationDeadline date={tournament.lastRegistrationDate} className="mb-3" />
      <AddTeamButton onClick={onAddTeam} disabled={addTeamDisabled} className="w-full" />
    </aside>
  )
}

export default TournamentSidebar
