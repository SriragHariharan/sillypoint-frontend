import Skeleton from './Skeleton'

function TournamentDetailsSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto max-w-6xl px-5 pb-32 pt-5 sm:px-6 sm:pb-16 sm:pt-8">
      <span className="sr-only">Loading tournament…</span>
      <Skeleton className="h-4 w-32 rounded" />

      <div className="mt-4 flex items-start gap-4">
        <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-3 pt-1">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-7 w-3/4 rounded" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="col-span-2 h-16 rounded-xl sm:col-span-1" />
            <Skeleton className="col-span-2 h-16 rounded-xl sm:col-span-1" />
          </div>

          <div className="mt-6 flex gap-2 border-b border-gray-200 pb-3">
            <Skeleton className="h-5 flex-1 rounded sm:w-24 sm:flex-none" />
            <Skeleton className="h-5 flex-1 rounded sm:w-24 sm:flex-none" />
            <Skeleton className="h-5 flex-1 rounded sm:w-24 sm:flex-none" />
          </div>

          <div className="mt-5 space-y-3">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4 sm:p-5">
          <Skeleton className="h-3 w-20 rounded" />
          <div className="mt-3 flex items-center gap-3">
            <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentDetailsSkeleton
