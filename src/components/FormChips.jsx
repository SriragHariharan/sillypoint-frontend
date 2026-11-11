import { FORM_LABELS, FORM_STYLES } from '../lib/standings'

// The last few results, latest first
function FormChips({ form }) {
  if (form.length === 0) return <span className="text-gray-400">—</span>

  return (
    <span className="inline-flex gap-1">
      {form.map((result, index) => (
        <span
          key={index}
          title={FORM_LABELS[result]}
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${FORM_STYLES[result]}`}
        >
          {result}
        </span>
      ))}
    </span>
  )
}

export default FormChips
