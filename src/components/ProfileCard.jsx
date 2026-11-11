import { BadgeCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cardClass, dangerOutlineButtonClass, infoNoteClass } from '../lib/premiumStyles'
import { signOut } from '../lib/session'
import Avatar from './Avatar'

function ProfileCard({ user }) {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const onLogout = async () => {
    setLoggingOut(true)
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <section className={`${cardClass} hidden p-4 sm:block sm:p-5`}>
      <div className="flex items-center gap-3">
        <Avatar src={user?.avatar} size="lg" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Your profile</p>
          <p className="mt-1 truncate text-lg font-black text-gray-900">+91 {user?.mobile}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-red-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-red-600">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Verified mobile
          </span>
        </div>
      </div>

      <p className={`${infoNoteClass} mt-4 text-xs text-gray-600`}>
        You sign in with your mobile number and an OTP. Change your photo from the account menu at the top right; names
        are coming soon.
      </p>

      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className={`mt-4 w-full ${dangerOutlineButtonClass}`}
      >
        {loggingOut ? 'Logging out…' : 'Log out'}
      </button>
    </section>
  )
}

export default ProfileCard
