import { cardClass } from '../lib/premiumStyles'

function ExtrasRow({ extras }) {
  const parts = [
    ['b', extras.byes],
    ['lb', extras.legByes],
    ['wd', extras.wides],
    ['nb', extras.noBalls],
  ]

  return (
    <div className={`${cardClass} flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3`}>
      <span className="text-[11px] font-black uppercase tracking-widest text-red-700">Extras</span>
      <span className="text-xl font-black tabular-nums text-gray-900">{extras.total}</span>
      <span className="flex flex-wrap gap-1.5">
        {parts.map(([label, value]) => (
          <span key={label} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-gray-700">
            {label} {value}
          </span>
        ))}
      </span>
    </div>
  )
}

export default ExtrasRow
