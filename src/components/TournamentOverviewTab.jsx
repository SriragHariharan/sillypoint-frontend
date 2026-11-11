import { FileText } from 'lucide-react'
import EmptyState from './EmptyState'
import TournamentInfoGrid from './TournamentInfoGrid'

function TournamentOverviewTab({ tournament }) {
  const { description } = tournament

  return (
    <>
      <TournamentInfoGrid tournament={tournament} />

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-red-700">About</h2>
      {description ? (
        <div
          className="mt-2 text-sm leading-relaxed text-gray-700 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <div className="mt-3">
          <EmptyState icon={FileText} title="No description yet">
            The organizer hasn&apos;t added a description yet.
          </EmptyState>
        </div>
      )}
    </>
  )
}

export default TournamentOverviewTab
