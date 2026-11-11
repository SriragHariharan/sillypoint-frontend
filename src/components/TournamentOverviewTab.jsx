import { FileText } from 'lucide-react'
import EmptyState from './EmptyState'

function TournamentOverviewTab({ description }) {
  if (!description) {
    return (
      <EmptyState icon={FileText} title="No description yet">
        The organizer hasn&apos;t added a description yet.
      </EmptyState>
    )
  }

  return (
    <div
      className="text-sm leading-relaxed text-gray-700 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  )
}

export default TournamentOverviewTab
