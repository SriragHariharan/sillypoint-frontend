import { CalendarClock } from 'lucide-react'
import { infoNoteClass } from '../lib/premiumStyles'
import { formatDate } from '../lib/formatDate'

function RegistrationClosedNote({ lastRegistrationDate }) {
  return (
    <p className={`${infoNoteClass} mt-4 flex items-center gap-2 text-sm font-medium text-red-700`}>
      <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
      Registration closed on {formatDate(lastRegistrationDate)}. Teams can no longer be added.
    </p>
  )
}

export default RegistrationClosedNote
