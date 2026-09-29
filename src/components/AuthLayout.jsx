import { Link } from 'react-router-dom'
import logo from '../assets/app_logo.png'

function AuthLayout({ title, subtitle, children, flatOnMobile = false }) {
  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:px-6 ${
        flatOnMobile ? 'bg-white sm:bg-gray-50' : 'bg-gray-50'
      }`}
    >
      <Link to="/" className="mb-8 flex items-center gap-2">
        <img src={logo} alt="Sillypoint" className="h-9 w-9 rounded-md" />
        <span className="text-lg font-bold tracking-tight text-gray-900">Sillypoint</span>
      </Link>

      <div
        className={`w-full max-w-sm sm:max-w-md sm:rounded-2xl sm:border sm:border-gray-200 sm:bg-white sm:p-8 sm:shadow-xl ${
          flatOnMobile ? '' : 'rounded-2xl border border-gray-200 bg-white p-6 shadow-xl'
        }`}
      >
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>

      <Link
        to="/"
        className="mt-6 text-sm font-medium text-gray-500 transition hover:text-red-600"
      >
        ← Back to home
      </Link>
    </div>
  )
}

export default AuthLayout
