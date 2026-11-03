import { inputClass, labelClass } from '../lib/formStyles'
import { prizeMoneyValidation, registrationFeeValidation } from '../lib/validators'
import FieldError from './FieldError'

function TournamentMoneyFields({ register, errors }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="registrationFee" className={labelClass}>
          Registration fee (₹)
        </label>
        <input
          id="registrationFee"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          className={inputClass(errors.registrationFee)}
          {...register('registrationFee', registrationFeeValidation)}
        />
        <p className="mt-1.5 text-xs text-gray-500">
          Cannot be changed after the tournament is created. Enter 0 for a free tournament.
        </p>
        <FieldError error={errors.registrationFee} />
      </div>
      <div>
        <label htmlFor="prizeMoney" className={labelClass}>
          Prize money (₹)
        </label>
        <input
          id="prizeMoney"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          className={inputClass(errors.prizeMoney)}
          {...register('prizeMoney', prizeMoneyValidation)}
        />
        <p className="mt-1.5 text-xs text-gray-500">You can update this later.</p>
        <FieldError error={errors.prizeMoney} />
      </div>
    </div>
  )
}

export default TournamentMoneyFields
