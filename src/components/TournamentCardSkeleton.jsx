import Skeleton from './Skeleton'

function TournamentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2.5 pt-1">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        <Skeleton className="h-3.5 w-2/3 rounded" />
        <Skeleton className="h-3.5 w-1/2 rounded" />
      </div>
    </div>
  )
}

export default TournamentCardSkeleton
