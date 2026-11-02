import TeamCardSkeleton from './TeamCardSkeleton'

const SKELETON_COUNT = 2

function LoadingCards({ label }) {
  return (
    <div aria-busy="true" className="grid gap-3 sm:grid-cols-2">
      <span className="sr-only">{label}</span>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <TeamCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default LoadingCards
