import { useEffect } from 'react'

function ModalShell({ title, subtitle, onClose, children, footer }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && onClose) onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl"
      >
        <div className="shrink-0 border-b border-gray-200 px-5 py-3">
          <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 short:space-y-3 short:py-3">{children}</div>
        {footer && <div className="flex shrink-0 gap-3 border-t border-gray-200 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}

export default ModalShell
