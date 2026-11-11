import logo from '../assets/app_logo.png'

function FullPageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full animate-spin text-red-600 [animation-duration:6s] motion-reduce:animate-none"
        >
          <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9" />
        </svg>
        <img src={logo} alt="Sillypoint" className="h-10 w-10 animate-pulse rounded-md" />
      </div>
      <p className="text-sm font-medium text-gray-500">Loading…</p>
    </div>
  )
}

export default FullPageLoader
