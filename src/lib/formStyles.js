export const inputClass = (hasError) =>
  `w-full rounded-xl border px-3 py-3 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 ${
    hasError ? 'border-red-400' : 'border-gray-300'
  }`

export const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'
