import toast from 'react-hot-toast'

const variants = {
  error: {
    role: 'alert',
    card: 'border-red-200',
    bar: 'bg-red-600',
    icon: 'bg-red-600 text-white',
    path: 'M12 6.5v7M12 17.5v.01',
  },
  info: {
    role: 'status',
    card: 'border-gray-200',
    bar: 'bg-gray-900',
    icon: 'bg-gray-900 text-white',
    path: 'M6 12.5l4 4L18 8',
  },
}

function AppToast({ t, type = 'error', message }) {
  const variant = variants[type]

  return (
    <div
      role={variant.role}
      className={`pointer-events-auto relative flex w-[calc(100vw-2rem)] max-w-md items-start gap-3 overflow-hidden rounded-xl border bg-white py-3.5 pl-5 pr-3 shadow-xl ${variant.card} ${
        t.visible ? 'animate-toast-in' : 'opacity-0 transition duration-150'
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 ${variant.bar}`} />

      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${variant.icon}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d={variant.path} />
        </svg>
      </span>

      <p className="flex-1 pt-1 text-sm font-semibold text-gray-900">{message}</p>

      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss notification"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-red-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-4 w-4"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  )
}

export default AppToast
