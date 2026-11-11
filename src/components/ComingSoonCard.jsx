import { ClipboardList, Trophy, Users } from 'lucide-react'
import { cardClass } from '../lib/premiumStyles'

const ITEMS = [
  { icon: Users, label: 'Manage your teams' },
  { icon: ClipboardList, label: 'Fixtures and live scoring' },
  { icon: Trophy, label: 'Standings and stats' },
]

function ComingSoonCard() {
  return (
    <section className={`${cardClass} p-4 sm:p-5`}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-red-700">Coming soon</h2>
      <ul className="mt-3 space-y-2.5 text-sm text-gray-700">
        {ITEMS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ComingSoonCard
