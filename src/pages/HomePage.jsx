import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { getErrorMessage } from '../lib/api'
import { fetchMe } from '../lib/authApi'
import { signOut } from '../lib/session'
import { useAuthStore } from '../store/authStore'

function HomePage() {
  const navigate = useNavigate()
  const storedUser = useAuthStore((state) => state.user)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    let active = true

    fetchMe()
      .then((data) => active && setProfile(data.user))
      .catch((err) => active && setError(getErrorMessage(err)))

    return () => {
      active = false
    }
  }, [])

  const user = profile ?? storedUser

  const onLogout = async () => {
    setLoggingOut(true)
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <AuthLayout title="Welcome" subtitle="You're logged in to Sillypoint.">
      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        Signed in as +91 {user?.mobile}. Your tournament dashboard is coming soon.
      </p>

      {error && <p className="mt-4 text-xs font-medium text-red-600">{error}</p>}

      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className="mt-6 w-full rounded-full border border-red-600 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
      >
        {loggingOut ? 'Logging out…' : 'Log out'}
      </button>
    </AuthLayout>
  )
}

export default HomePage
