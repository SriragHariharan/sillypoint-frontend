const styles = {
  live: 'bg-red-600 text-white',
  upcoming: 'border border-red-600 text-red-600',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-gray-100 text-gray-500 line-through',
}

const labels = {
  live: 'Live',
  upcoming: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${styles[status]}`}
    >
      {status === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
      {labels[status]}
    </span>
  )
}

export default StatusBadge
