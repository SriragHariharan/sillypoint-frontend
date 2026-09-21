import { Link } from 'react-router-dom'
import notFoundImg from '../assets/404-icon.png'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 py-10 text-center sm:px-6">
      <img
        src={notFoundImg}
        alt="A cricket ground with the pitch missing"
        className="w-full max-w-xs sm:max-w-sm"
      />

      <span className="mt-6 inline-block rounded-full bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
        404 error
      </span>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        That&apos;s Out!
      </h1>

      <p className="mt-3 max-w-md text-base text-gray-600">
        This page has been given out — caught behind, and gone for good. Let&apos;s get you back
        to the middle of the ground.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
      >
        Back to home
      </Link>
    </div>
  )
}

export default NotFoundPage
