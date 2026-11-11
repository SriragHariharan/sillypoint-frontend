import { RotateCw } from 'lucide-react'
import { primaryButtonClass } from '../lib/premiumStyles'

function RetryPanel({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
      <p className="text-base font-bold text-gray-900">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className={`mt-4 inline-flex items-center gap-2 px-6 ${primaryButtonClass}`}
      >
        <RotateCw className="h-4 w-4 shrink-0" aria-hidden="true" />
        Retry
      </button>
    </div>
  )
}

export default RetryPanel
