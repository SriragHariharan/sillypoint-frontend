function Skeleton({ className = '', dark = false }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer bg-linear-to-r ${dark ? 'from-white/5 via-white/15 to-white/5' : 'from-gray-100 via-gray-200 to-gray-100'} bg-size-[200%_100%] motion-reduce:animate-none ${className}`}
    />
  )
}

export default Skeleton
