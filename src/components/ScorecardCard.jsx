import { cardClass } from '../lib/premiumStyles'

// A titled white card with a broadcast style label bar; the scorecard's tables and timelines sit in these
function ScorecardCard({ title, children }) {
  return (
    <section className={`${cardClass} overflow-hidden`}>
      <h3 className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-red-700">
        {title}
      </h3>
      {children}
    </section>
  )
}

export default ScorecardCard
