import { useEffect } from 'react'
import { headingClass } from '../lib/premiumStyles'

const SIZES = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', xl: 'sm:max-w-xl' }

function ModalShell({ title, subtitle, onClose, children, footer, busy = false, size = 'md' }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && onClose && !busy) onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, busy])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={busy ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-red-600/10 sm:rounded-3xl ${SIZES[size]}`}
      >
        <div className="h-1 shrink-0 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />
        <div className="shrink-0 border-b border-gray-200 px-5 py-3">
          <h2 className={`text-lg ${headingClass}`}>{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 short:space-y-3 short:py-3">{children}</div>
        {footer && <div className="flex shrink-0 gap-3 border-t border-gray-200 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}

export default ModalShell
