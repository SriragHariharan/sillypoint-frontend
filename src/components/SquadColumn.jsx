import { useWatch } from 'react-hook-form'
import { filledCount } from '../lib/squad'
import Avatar from './Avatar'
import PlayerRow from './PlayerRow'

function SquadColumn({ side, team, total, register, control, errors }) {
  const values = useWatch({ control, name: side })
  const count = filledCount(values)

  const group = (key, title, rows) => {
    if (rows.length === 0) return null

    return (
      <section>
        <h3 className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-red-700">{title}</h3>
        <ul className="space-y-2">
          {rows.map((_, index) => (
            <PlayerRow
              key={index}
              side={side}
              group={key}
              index={index}
              label={key === 'playing' ? index + 1 : `S${index + 1}`}
              register={register}
              errors={errors}
            />
          ))}
        </ul>
      </section>
    )
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="-mx-3 -mt-3 mb-3 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700 sm:-mx-4 sm:-mt-4 sm:mb-4" />
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 sm:gap-3">
        <Avatar src={team.logo} name={team.name} size="xs" rounded="rounded-lg" />
        <h2 className="min-w-0 flex-1 break-words text-sm font-black leading-tight text-gray-900 sm:text-base">
          {team.name}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
            count === total ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'
          }`}
        >
          {count}/{total}
        </span>
      </div>

      {group('playing', 'Players', values.playing)}
      {group('substitutes', 'Substitutes', values.substitutes)}
    </div>
  )
}

export default SquadColumn
