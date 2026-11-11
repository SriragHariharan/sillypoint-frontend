import { FileText } from 'lucide-react'
import { cardClass } from '../lib/premiumStyles'
import EmptyState from './EmptyState'
import OrganizerContactCard from './OrganizerContactCard'
import TournamentInfoGrid from './TournamentInfoGrid'

function TournamentOverviewTab({ tournament }) {
  const { description } = tournament

  return (
    <>
      <TournamentInfoGrid tournament={tournament} />
      <OrganizerContactCard organizer={tournament.organizer} />

      {description ? (
        <section className={`${cardClass} mt-3 p-4 sm:mt-4 sm:p-5`}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-red-700">About</h2>
          <div
            className="mt-2 text-sm leading-relaxed text-gray-700 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </section>
      ) : (
        <div className="mt-3 sm:mt-4">
          <EmptyState icon={FileText} title="No description yet">
            The organizer hasn&apos;t added a description yet.
          </EmptyState>
        </div>
      )}
    </>
  )
}

export default TournamentOverviewTab
