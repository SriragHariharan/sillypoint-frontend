import { RotateCw, WifiOff } from 'lucide-react'
import { primaryButtonClass } from '../lib/premiumStyles'
import EmptyState from './EmptyState'

function LoadErrorScreen({ title, onRetry }) {
  return (
    <main className="mx-auto max-w-md px-5 py-20">
      <EmptyState
        as="h1"
        icon={WifiOff}
        title={title}
        action={
          <button type="button" onClick={onRetry} className={`inline-flex items-center gap-2 px-6 ${primaryButtonClass}`}>
            <RotateCw className="h-4 w-4 shrink-0" aria-hidden="true" />
            Retry
          </button>
        }
      >
        Check your connection and try again.
      </EmptyState>
    </main>
  )
}

export default LoadErrorScreen
