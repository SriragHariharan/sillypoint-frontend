function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200%_100%] motion-reduce:animate-none ${className}`}
    />
  )
}

export default Skeleton
