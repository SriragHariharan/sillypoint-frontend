import { Copy } from 'lucide-react'
import { useScorerAccess } from '../hooks/useScorerAccess'
import { notifyError, notifyInfo } from '../lib/notify'
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

function CopyRow({ id, label, value }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          readOnly
          value={value}
          onFocus={(event) => event.target.select()}
          className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
        />
        <button
          type="button"
          onClick={() => copyText(value, label)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
        >
          <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
          Copy
        </button>
      </div>
    </div>
  )
}

function ScorerAccessCard({ matchId, scorerName }) {
  const { access, loading, failed, retry } = useScorerAccess(matchId)

  return (
    <section className="mt-4 rounded-2xl border border-gray-200 p-4 sm:p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Scorer access</h2>
      <p className="mt-2 text-sm text-gray-700">
        Share this link and PIN with {scorerName}. They log in with their mobile number and the PIN.
      </p>

      <div className="mt-4 space-y-4">
        {loading && (
          <div aria-busy="true" className="space-y-4">
            <span className="sr-only">Loading scorer access…</span>
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
        )}
        {!loading && failed && (
          <button
            type="button"
            onClick={retry}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        )}
        {!loading && access && (
          <>
            <CopyRow id="scorer-link" label="Login link" value={scorerLinkUrl(access.linkToken)} />
            <CopyRow id="scorer-pin" label="PIN" value={access.pin} />
          </>
        )}
      </div>
    </section>
  )
}

export default ScorerAccessCard
