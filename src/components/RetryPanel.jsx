function RetryPanel({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center">
      <p className="text-base font-bold text-gray-900">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  )
}

export default RetryPanel
