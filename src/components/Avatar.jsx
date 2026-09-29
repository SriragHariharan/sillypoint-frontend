const sizes = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-lg',
  lg: 'h-20 w-20 text-2xl',
}

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

function Avatar({ src, name, size = 'md', rounded = 'rounded-full' }) {
  const box = `${sizes[size]} ${rounded} shrink-0`

  if (src) {
    return <img src={src} alt={name} className={`${box} border border-gray-200 object-cover`} />
  }

  return (
    <span
      aria-label={name}
      className={`${box} flex items-center justify-center bg-red-50 font-bold text-red-600`}
    >
      {initialsOf(name)}
    </span>
  )
}

export default Avatar
