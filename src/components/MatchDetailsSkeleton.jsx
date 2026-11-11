import Skeleton from './Skeleton'

function MatchDetailsSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto max-w-3xl px-5 pb-16 pt-5 sm:px-6 sm:pt-8">
      <span className="sr-only">Loading match…</span>
      <Skeleton className="h-4 w-40 rounded" />
      <Skeleton className="mt-6 h-72 rounded-3xl" />
    </div>
  )
}

export default MatchDetailsSkeleton
