const styles = {
  live: 'bg-red-600 text-white',
  upcoming: 'border border-red-600 text-red-600',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-gray-100 text-gray-500 line-through',
}

const darkStyles = {
  live: 'bg-red-600 text-white',
  upcoming: 'border border-red-400 text-red-300',
  completed: 'bg-white/10 text-gray-300',
  cancelled: 'bg-white/10 text-gray-400 line-through',
}

const labels = {
  live: 'Live',
  upcoming: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function StatusBadge({ status, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${(dark ? darkStyles : styles)[status]}`}
    >
      {status === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
      {labels[status]}
    </span>
  )
}

export default StatusBadge
