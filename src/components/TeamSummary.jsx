import { cardClass } from '../lib/premiumStyles'
import Skeleton from './Skeleton'

const TILES = [
  { key: 'played', label: 'Played' },
  { key: 'won', label: 'Won', accent: true },
  { key: 'lost', label: 'Lost' },
  { key: 'tied', label: 'Tied' },
  { key: 'upcoming', label: 'Upcoming' },
]

function TeamSummary({ summary }) {
  return (
    <section aria-label="Match summary" className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
      {TILES.map((tile) => (
        <div key={tile.key} className={`${cardClass} px-1 py-3 text-center`}>
          {summary ? (
            <p className={`text-xl font-black sm:text-2xl ${tile.accent ? 'text-red-600' : 'text-gray-900'}`}>
              {summary[tile.key]}
            </p>
          ) : (
            <Skeleton className="mx-auto h-7 w-7 rounded" />
          )}
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">{tile.label}</p>
        </div>
      ))}
    </section>
  )
}

export default TeamSummary
