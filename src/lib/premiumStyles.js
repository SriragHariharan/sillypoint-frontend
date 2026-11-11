export const eyebrowClass =
  'inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-red-700'

export const headingClass = 'font-black leading-tight tracking-tight text-gray-900'

export const primaryButtonClass =
  'rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-gray-300'

export const secondaryButtonClass =
  'rounded-full border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:hover:border-gray-200 disabled:hover:text-gray-400'

export const redGlow = (size, position, alpha) =>
  `radial-gradient(${size} at ${position}, rgba(166, 25, 46, ${alpha}), transparent 70%)`
