import { cardClass } from '../lib/premiumStyles'
import Avatar from './Avatar'
import AddTeamButton from './AddTeamButton'
import ManageTournament from './ManageTournament'

function TournamentSidebar({ tournament, canManage, showAddTeam, onAddTeam, addTeamDisabled, onChanged }) {
  const { organizer } = tournament

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <section className={`${cardClass} p-4 sm:p-5`}>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-red-700">Organizer</h2>
        <div className="mt-3 flex items-center gap-3">
          <Avatar src={organizer.avatar} size="md" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Contact</p>
            <a
              href={`tel:+91${organizer.mobile}`}
              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              +91 {organizer.mobile}
            </a>
          </div>
        </div>
      </section>

      {canManage && (
        <div className="mt-4">
          <ManageTournament
            key={`${tournament.startDate}|${tournament.endDate}`}
            tournament={tournament}
            onChanged={onChanged}
          />
        </div>
      )}

      {showAddTeam && (
        <AddTeamButton onClick={onAddTeam} disabled={addTeamDisabled} className="mt-4 hidden w-full sm:block" />
      )}
    </aside>
  )
}

export default TournamentSidebar
