import Skeleton from './Skeleton'

const SKELETON_COUNT = 2

function CardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-3.5 w-1/2 rounded" />
      </div>
    </div>
  )
}

function LoadingCards({ label }) {
  return (
    <div aria-busy="true" className="grid gap-4 sm:grid-cols-2">
      <span className="sr-only">{label}</span>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}

export default LoadingCards
