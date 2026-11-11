import { CalendarClock } from 'lucide-react'
import { formatDate } from '../lib/formatDate'

function RegistrationDeadline({ date, compact = false, className = '' }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 ${
        compact ? 'px-3 py-2' : 'px-4 py-3'
      } ${className}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm ${
          compact ? 'h-8 w-8' : 'h-10 w-10'
        }`}
      >
        <CalendarClock className={compact ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">Last date to register</p>
        <p className={`font-black leading-tight text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
          {formatDate(date)}
        </p>
      </div>
    </div>
  )
}

export default RegistrationDeadline
