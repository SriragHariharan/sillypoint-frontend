import { Phone } from 'lucide-react'
import { cardClass, compactSecondaryButtonClass } from '../lib/premiumStyles'
import Avatar from './Avatar'

function OrganizerContactCard({ organizer }) {
  return (
    <section className={`${cardClass} mt-3 flex items-center gap-3 p-3.5 sm:mt-4 sm:p-4`}>
      <Avatar src={organizer.avatar} size="md" rounded="rounded-xl" />
      <div className="min-w-0 flex-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Organizer</h2>
        <p className="mt-0.5 truncate text-base font-black text-gray-900">+91 {organizer.mobile}</p>
      </div>
      <a
        href={`tel:+91${organizer.mobile}`}
        className={`inline-flex shrink-0 items-center gap-1.5 ${compactSecondaryButtonClass}`}
      >
        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
        Call
      </a>
    </section>
  )
}

export default OrganizerContactCard
