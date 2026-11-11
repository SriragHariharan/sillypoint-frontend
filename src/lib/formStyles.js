export const inputClass = (hasError) =>
  `w-full rounded-xl border bg-white px-3 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100 ${
    hasError ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
  }`

export const fieldGroupClass = (hasError) =>
  `flex items-center overflow-hidden rounded-xl border bg-white shadow-sm transition focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100 ${
    hasError ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
  }`

export const fieldAddonClass =
  'flex items-center border-r border-red-100 bg-red-50 px-3 py-3 text-sm font-semibold text-red-700'

export const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'
