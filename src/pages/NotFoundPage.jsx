import { Link } from 'react-router-dom'
import notFoundImg from '../assets/404-icon.png'
import { eyebrowClass, headingClass, primaryButtonClass, redGlow } from '../lib/premiumStyles'

function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-5 py-10 text-center sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: `${redGlow('55% 60%', '12% 18%', 0.1)}, ${redGlow('45% 50%', '90% 85%', 0.06)}` }}
      />

      <img
        src={notFoundImg}
        alt="A cricket ground with the pitch missing"
        className="relative w-full max-w-xs sm:max-w-sm"
      />

      <span className={`relative mt-6 ${eyebrowClass}`}>404 error</span>

      <h1 className={`relative mt-4 text-3xl sm:text-5xl ${headingClass}`}>
        That&apos;s <span className="text-red-600">Out!</span>
      </h1>

      <p className="relative mt-3 max-w-md text-base text-gray-600">
        This page has been given out — caught behind, and gone for good. Let&apos;s get you back
        to the middle of the ground.
      </p>

      <Link to="/" className={`relative mt-8 px-7 ${primaryButtonClass}`}>
        Back to home
      </Link>
    </div>
  )
}

export default NotFoundPage
