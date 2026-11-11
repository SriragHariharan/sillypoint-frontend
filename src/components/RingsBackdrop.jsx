const RINGS = [90, 150, 210, 270]

function RingsBackdrop({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 600"
      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      {RINGS.map((radius) => (
        <circle key={radius} cx="300" cy="300" r={radius} fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />
      ))}
      <circle cx="300" cy="300" r="300" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="2" strokeDasharray="2 12" />
    </svg>
  )
}

export default RingsBackdrop
