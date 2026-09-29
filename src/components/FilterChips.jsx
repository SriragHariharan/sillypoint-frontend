function FilterChips({ options, value, onChange, label }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active
                ? 'border-red-600 bg-red-600 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-red-600 hover:text-red-600'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default FilterChips
