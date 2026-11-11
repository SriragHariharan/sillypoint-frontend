import { useParams, useSearchParams } from 'react-router-dom'
import AddMatchModal from '../components/AddMatchModal'
import AddTeamsModal from '../components/AddTeamsModal'
import LoadErrorScreen from '../components/LoadErrorScreen'
import MobileAddTeamBar from '../components/MobileAddTeamBar'
import RegistrationClosedNote from '../components/RegistrationClosedNote'
import NotFoundScreen from '../components/NotFoundScreen'
import TournamentDetailsSkeleton from '../components/TournamentDetailsSkeleton'
import TournamentHeader from '../components/TournamentHeader'
import TournamentMatchesTab from '../components/TournamentMatchesTab'
import TournamentOverviewTab from '../components/TournamentOverviewTab'
import TournamentPageShell from '../components/TournamentPageShell'
import TournamentSidebar from '../components/TournamentSidebar'
import TournamentTabs from '../components/TournamentTabs'
import TournamentTeamsTab from '../components/TournamentTeamsTab'
import { useAddTeamFlow } from '../hooks/useAddTeamFlow'
import { useTournamentDetails } from '../hooks/useTournamentDetails'
import { useTournamentMatches } from '../hooks/useTournamentMatches'
import { useTournamentTeams } from '../hooks/useTournamentTeams'
import { resolveTab } from '../lib/tournamentTabs'
import { useAuthStore } from '../store/authStore'

function TournamentDetailsPage() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const user = useAuthStore((state) => state.user)
  const authStatus = useAuthStore((state) => state.status)

  const details = useTournamentDetails(id)
  const teams = useTournamentTeams(id)
  const matches = useTournamentMatches(id)
  const addedIds = teams.teams.map((team) => team.id)
  const addTeam = useAddTeamFlow({ addedIds, enroll: teams.enroll, adding: teams.adding })

  const tab = resolveTab(params.get('tab'))

  const setTab = (value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === 'overview') next.delete('tab')
        else next.set('tab', value)
        return next
      },
      { replace: true },
    )
  }

  if (details.loading) {
    return (
      <TournamentPageShell>
        <TournamentDetailsSkeleton />
      </TournamentPageShell>
    )
  }

  if (details.failed) {
    return (
      <TournamentPageShell>
        <LoadErrorScreen title="Couldn't load this tournament" onRetry={details.retry} />
      </TournamentPageShell>
    )
  }

  const { tournament } = details

  if (!tournament) {
    return (
      <TournamentPageShell>
        <NotFoundScreen
          title="Tournament not found"
          message="It may have been removed or the link is wrong."
          to="/tournaments"
          label="Browse tournaments"
        />
      </TournamentPageShell>
    )
  }

  const isOrganizer = Boolean(user) && user.id === tournament.organizer.id
  const canManage = tournament.status === 'upcoming' || tournament.status === 'live'
  const canAddMatch = isOrganizer && canManage
  const acceptsTeams = tournament.status !== 'cancelled' && tournament.status !== 'completed'
  const showAddTeam = !isOrganizer && authStatus !== 'loading' && acceptsTeams && !tournament.registrationClosed
  const showClosedNote = !isOrganizer && acceptsTeams && tournament.registrationClosed

  return (
    <TournamentPageShell>
      <main
        className={`mx-auto max-w-6xl px-5 pt-5 sm:px-6 sm:pb-16 sm:pt-8 ${showAddTeam ? 'pb-44' : 'pb-16'}`}
      >
        <TournamentHeader tournament={tournament} />
        {showClosedNote && <RegistrationClosedNote lastRegistrationDate={tournament.lastRegistrationDate} />}

        <TournamentTabs tab={tab} onChange={setTab} teamCount={teams.teams.length} />

        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div role="tabpanel">
              {tab === 'overview' && <TournamentOverviewTab tournament={tournament} />}
              {tab === 'teams' && (
                <TournamentTeamsTab
                  teams={teams.teams}
                  loading={teams.loading}
                  failed={teams.failed}
                  onRetry={teams.reload}
                  canRemove={(team) => isOrganizer || (Boolean(user) && team.added_by === user.id)}
                  onRemove={teams.removeTeam}
                />
              )}
              {tab === 'matches' && (
                <TournamentMatchesTab
                  matches={matches.matches}
                  loading={matches.loading}
                  failed={matches.failed}
                  onRetry={matches.reload}
                  canAddMatch={canAddMatch}
                  onAddMatch={matches.openAddMatch}
                />
              )}
            </div>
          </div>

          <TournamentSidebar
            tournament={tournament}
            canManage={isOrganizer && canManage}
            showAddTeam={showAddTeam}
            onAddTeam={addTeam.onAddTeam}
            addTeamDisabled={addTeam.busy}
            onChanged={details.patchTournament}
          />
        </div>
      </main>

      {showAddTeam && (
        <MobileAddTeamBar
          onClick={addTeam.onAddTeam}
          disabled={addTeam.busy}
          lastRegistrationDate={tournament.lastRegistrationDate}
        />
      )}
      {matches.showAddMatch && (
        <AddMatchModal
          teams={teams.teams}
          tournament={tournament}
          submitting={matches.creating}
          onClose={matches.closeAddMatch}
          onSubmit={matches.createMatch}
        />
      )}
      {addTeam.myTeams && (
        <AddTeamsModal
          teams={addTeam.myTeams}
          addedIds={addedIds}
          adding={teams.adding}
          onClose={addTeam.closeModal}
          onConfirm={addTeam.confirm}
        />
      )}
    </TournamentPageShell>
  )
}

export default TournamentDetailsPage
