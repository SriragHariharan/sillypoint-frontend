import { inputClass, labelClass } from '../lib/formStyles'
import { todayISO } from '../lib/validators'
import FieldError from './FieldError'

const nowTimeHHmm = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function MatchScheduleFields({ register, errors, tournament, idPrefix, dateLabel, timeLabel }) {
  const today = todayISO()
  const minDate = tournament.startDate > today ? tournament.startDate : today

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor={`${idPrefix}-date`} className={labelClass}>
          {dateLabel}
        </label>
        <input
          id={`${idPrefix}-date`}
          type="date"
          min={minDate}
          max={tournament.endDate}
          className={inputClass(Boolean(errors.matchDate))}
          {...register('matchDate', {
            required: 'Select the match date',
            validate: (value) =>
              (value >= minDate && value <= tournament.endDate) || 'Date must be within the tournament dates',
            deps: ['matchTime'],
          })}
        />
        <FieldError error={errors.matchDate} />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-time`} className={labelClass}>
          {timeLabel}
        </label>
        <input
          id={`${idPrefix}-time`}
          type="time"
          className={inputClass(Boolean(errors.matchTime))}
          {...register('matchTime', {
            required: 'Select the start time',
            validate: (value, values) =>
              values.matchDate !== today || value > nowTimeHHmm() || 'Start time cannot be in the past',
          })}
        />
        <FieldError error={errors.matchTime} />
      </div>
    </div>
  )
}

export default MatchScheduleFields
