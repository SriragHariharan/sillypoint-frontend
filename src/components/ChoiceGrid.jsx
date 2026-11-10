function ChoiceGrid({ label, options, value, onChange, columns = 4 }) {
  const cols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 7: 'grid-cols-7' }[columns]

  return (
    <div>
      {label && <p className="mb-2 text-sm font-medium text-gray-700">{label}</p>}
      <div role="radiogroup" aria-label={label} className={`grid gap-2 ${cols}`}>
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-xl border px-2 py-2.5 text-sm short:py-2 font-semibold transition ${
                selected
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-gray-300 bg-white text-gray-800 hover:border-red-600 hover:text-red-600'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ChoiceGrid
