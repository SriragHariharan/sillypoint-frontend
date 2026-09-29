import logo from '../assets/app_logo.png'

function FullPageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
      <img src={logo} alt="Sillypoint" className="h-10 w-10 animate-pulse rounded-md" />
      <p className="text-sm font-medium text-gray-500">Loading…</p>
    </div>
  )
}

export default FullPageLoader
