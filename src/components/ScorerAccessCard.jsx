import { Copy, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useScorerAccess } from '../hooks/useScorerAccess'
import { notifyError, notifyInfo } from '../lib/notify'
import { cardClass, compactPrimaryButtonClass } from '../lib/premiumStyles'
import { scorerLinkUrl } from '../lib/scorerApi'
import Skeleton from './Skeleton'

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text)
    notifyInfo(`${label} copied.`)
  } catch {
    notifyError('Could not copy. Select the text and copy it manually.')
  }
}

const iconButtonClass =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-red-600 hover:text-red-600'

function Row({ label, value, title, className = '', children }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 py-1.5 ${className}`}>
      <span className="w-8 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <span title={title} className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
        {value}
      </span>
      {children}
    </div>
  )
}

function CopyButton({ label, text }) {
  return (
    <button type="button" onClick={() => copyText(text, label)} aria-label={`Copy ${label}`} title={`Copy ${label}`} className={iconButtonClass}>
      <Copy className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}

function PinRow({ pin }) {
  const [revealed, setRevealed] = useState(false)
  const Icon = revealed ? EyeOff : Eye

  return (
    <Row
      label="PIN"
      value={<span className="tracking-widest tabular-nums">{revealed ? pin : '•'.repeat(pin.length)}</span>}
      className="sm:w-64 sm:shrink-0 sm:border-l sm:border-gray-100 sm:pl-4"
    >
      <button
        type="button"
        onClick={() => setRevealed((current) => !current)}
        aria-label={revealed ? 'Hide PIN' : 'Show PIN'}
        aria-pressed={revealed}
        title={revealed ? 'Hide PIN' : 'Show PIN'}
        className={iconButtonClass}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
      <CopyButton label="PIN" text={pin} />
    </Row>
  )
}

function ScorerAccessCard({ matchId }) {
  const { access, loading, failed, retry } = useScorerAccess(matchId)
  const link = access ? scorerLinkUrl(access.linkToken) : ''

  return (
    <section className={`${cardClass} mt-3 px-3 py-2`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-red-700">Scorer access</h2>
        <p className="hidden truncate text-[11px] text-gray-500 min-[380px]:block">The scorer logs in with the PIN only</p>
      </div>

      {loading && (
        <div aria-busy="true" className="py-1.5">
          <span className="sr-only">Loading scorer access…</span>
          <Skeleton className="h-9 rounded-lg" />
        </div>
      )}

      {!loading && failed && (
        <div className="flex items-center justify-between gap-3 py-1.5">
          <p className="text-sm text-gray-600">Couldn&apos;t load scorer access.</p>
          <button type="button" onClick={retry} className={compactPrimaryButtonClass}>
            Retry
          </button>
        </div>
      )}

      {!loading && access && (
        <div className="divide-y divide-gray-100 sm:flex sm:divide-y-0">
          <Row label="Link" value={link} title={link} className="sm:flex-1 sm:pr-4">
            <CopyButton label="login link" text={link} />
          </Row>
          <PinRow pin={access.pin} />
        </div>
      )}
    </section>
  )
}

export default ScorerAccessCard
