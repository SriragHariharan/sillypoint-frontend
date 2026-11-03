import { inputClass, labelClass } from '../lib/formStyles'
import { endDateValidation, startDateValidation, todayISO } from '../lib/validators'
import FieldError from './FieldError'

function TournamentDateFields({ register, errors, getValues, startDate }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="startDate" className={labelClass}>
          Start date
        </label>
        <input
          id="startDate"
          type="date"
          min={todayISO()}
          className={inputClass(errors.startDate)}
          {...register('startDate', { ...startDateValidation, deps: ['endDate'] })}
        />
        <FieldError error={errors.startDate} />
      </div>
      <div>
        <label htmlFor="endDate" className={labelClass}>
          End date
        </label>
        <input
          id="endDate"
          type="date"
          min={startDate || todayISO()}
          className={inputClass(errors.endDate)}
          {...register('endDate', endDateValidation(() => getValues('startDate')))}
        />
        <FieldError error={errors.endDate} />
      </div>
    </div>
  )
}

export default TournamentDateFields
