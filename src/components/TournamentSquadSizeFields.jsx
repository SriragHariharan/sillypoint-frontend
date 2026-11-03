import {
  MAX_PLAYERS_PER_SIDE,
  MAX_SUBSTITUTES_PER_SIDE,
  MIN_PLAYERS_PER_SIDE,
  MIN_SUBSTITUTES_PER_SIDE,
} from '../lib/squad'
import { inputClass, labelClass } from '../lib/formStyles'
import { playersPerSideValidation, substitutesPerSideValidation } from '../lib/validators'
import FieldError from './FieldError'

function TournamentSquadSizeFields({ register, errors }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="playersPerSide" className={labelClass}>
          Players per side
        </label>
        <input
          id="playersPerSide"
          type="number"
          inputMode="numeric"
          min={MIN_PLAYERS_PER_SIDE}
          max={MAX_PLAYERS_PER_SIDE}
          step={1}
          className={inputClass(errors.playersPerSide)}
          {...register('playersPerSide', playersPerSideValidation)}
        />
        <p className="mt-1.5 text-xs text-gray-500">
          {MIN_PLAYERS_PER_SIDE} to {MAX_PLAYERS_PER_SIDE} players. Cannot be changed after the tournament is created.
        </p>
        <FieldError error={errors.playersPerSide} />
      </div>
      <div>
        <label htmlFor="substitutesPerSide" className={labelClass}>
          Substitutes per side
        </label>
        <input
          id="substitutesPerSide"
          type="number"
          inputMode="numeric"
          min={MIN_SUBSTITUTES_PER_SIDE}
          max={MAX_SUBSTITUTES_PER_SIDE}
          step={1}
          className={inputClass(errors.substitutesPerSide)}
          {...register('substitutesPerSide', substitutesPerSideValidation)}
        />
        <p className="mt-1.5 text-xs text-gray-500">
          {MIN_SUBSTITUTES_PER_SIDE} to {MAX_SUBSTITUTES_PER_SIDE} substitutes. Cannot be changed after the tournament is
          created.
        </p>
        <FieldError error={errors.substitutesPerSide} />
      </div>
    </div>
  )
}

export default TournamentSquadSizeFields
