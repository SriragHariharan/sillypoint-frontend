import { cardClass } from '../lib/premiumStyles'
import Skeleton from './Skeleton'

function StatTile({ label, value, loading }) {
  return (
    <div className={`${cardClass} p-3.5 text-center sm:p-4`}>
      {loading ? (
        <Skeleton className="mx-auto h-8 w-8 rounded" />
      ) : (
        <p className="text-3xl font-black leading-8 text-red-600">{value}</p>
      )}
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  )
}

export default StatTile
