import { Zap } from 'lucide-react'
import { decidedByText } from '../lib/scoringTeams'

// "Won the Super Over" / "Won on boundary count" when the regular innings did not decide the match
function DecidedByChip({ decidedBy, className = '' }) {
  const text = decidedByText(decidedBy)
  if (!text) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white ${className}`}
    >
      <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {text}
    </span>
  )
}

export default DecidedByChip
