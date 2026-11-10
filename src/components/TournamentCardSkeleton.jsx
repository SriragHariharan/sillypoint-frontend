import Skeleton from './Skeleton'

function TournamentCardSkeleton({ dark = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 ${
        dark ? 'border-white/10 bg-white/[0.04]' : 'border-gray-200 bg-white shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <Skeleton dark={dark} className="h-14 w-14 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2.5 pt-1">
          <Skeleton dark={dark} className="h-4 w-20 rounded-full" />
          <Skeleton dark={dark} className="h-4 w-3/4 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        <Skeleton dark={dark} className="h-3.5 w-2/3 rounded" />
        <Skeleton dark={dark} className="h-3.5 w-1/2 rounded" />
      </div>
    </div>
  )
}

export default TournamentCardSkeleton
