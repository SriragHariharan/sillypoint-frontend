import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAvatar } from '../hooks/useAvatar'
import { NAV_LINKS } from '../lib/navLinks'
import { signOut } from '../lib/session'
import { useAuthStore } from '../store/authStore'
import Avatar from './Avatar'

const menuItemClass =
  'block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60'

function ProfileMenu() {
  const navigate = useNavigate()
  const mobile = useAuthStore((state) => state.user?.mobile)
  const { avatar, busy, upload, remove } = useAvatar()
  const [open, setOpen] = useState(false)
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const containerRef = useRef(null)
  const fileInputRef = useRef(null)

  const close = () => {
    setOpen(false)
    setConfirmingRemove(false)
  }

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false)
        setConfirmingRemove(false)
      }
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setConfirmingRemove(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const onFileChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) await upload(file)
  }

  const onRemove = async () => {
    await remove()
    setConfirmingRemove(false)
  }

  const onLogout = async () => {
    setLoggingOut(true)
    await signOut()
    navigate('/', { replace: true })
  }

  const working = Boolean(busy)

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onFileChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center rounded-full ring-2 ring-transparent transition hover:ring-red-200 focus-visible:ring-red-300"
      >
        <Avatar src={avatar} size="sm" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl"
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar src={avatar} size="md" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Signed in as</p>
              <p className="mt-0.5 truncate text-sm font-bold text-gray-900">+91 {mobile}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-1">
            <button
              type="button"
              role="menuitem"
              disabled={working}
              onClick={() => fileInputRef.current?.click()}
              className={`${menuItemClass} text-gray-700 hover:bg-red-50 hover:text-red-600`}
            >
              {busy === 'uploading' ? 'Uploading…' : avatar ? 'Change photo' : 'Add photo'}
            </button>

            {avatar &&
              (confirmingRemove ? (
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-700">Remove your photo?</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={onRemove}
                      disabled={working}
                      className="rounded-full bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {busy === 'removing' ? 'Removing…' : 'Yes, remove'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingRemove(false)}
                      disabled={working}
                      className="rounded-full border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  disabled={working}
                  onClick={() => setConfirmingRemove(true)}
                  className={`${menuItemClass} text-gray-700 hover:bg-red-50 hover:text-red-600`}
                >
                  Remove photo
                </button>
              ))}
          </div>

          <div className="border-t border-gray-100 pt-1 sm:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                role="menuitem"
                onClick={close}
                className={`${menuItemClass} text-gray-700 hover:bg-red-50 hover:text-red-600`}
              >
                {link.label === 'Create' ? 'Create tournament' : link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              disabled={loggingOut || working}
              className={`${menuItemClass} font-semibold text-red-600 hover:bg-red-50 disabled:text-gray-400 disabled:hover:bg-transparent`}
            >
              {loggingOut ? 'Logging out…' : 'Log out'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
