import { PLAYER_NAME_MAX_LENGTH, playerNameValidation } from '../lib/validators'

function PlayerRow({ side, group, index, label, register, errors }) {
  const message = errors?.[side]?.[group]?.[index]?.name?.message

  return (
    <li>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="w-5 shrink-0 text-center text-xs font-bold text-gray-500">{label}</span>
        <input
          type="text"
          autoComplete="off"
          maxLength={PLAYER_NAME_MAX_LENGTH}
          placeholder="Player name"
          aria-label={`${group === 'playing' ? 'Player' : 'Substitute'} ${label} name`}
          className={`w-full min-w-0 flex-1 rounded-xl border bg-white px-2.5 py-2.5 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 sm:px-3 ${
            message ? 'border-red-400' : 'border-gray-300'
          }`}
          {...register(`${side}.${group}.${index}.name`, playerNameValidation(side))}
        />
      </div>
      {message && <p className="ml-6 mt-1 text-xs font-medium text-red-600 sm:ml-7">{message}</p>}
    </li>
  )
}

export default PlayerRow
