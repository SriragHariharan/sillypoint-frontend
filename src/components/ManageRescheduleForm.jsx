import { useForm, useWatch } from 'react-hook-form'
import { inputClass, labelClass } from '../lib/formStyles'
import { endDateValidation, rescheduleStartValidation, todayISO } from '../lib/validators'
import FieldError from './FieldError'
import ModalFooter from './ModalFooter'

function ManageRescheduleForm({ tournament, busy, onSubmit, onBack }) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { startDate: tournament.startDate, endDate: tournament.endDate } })
  const startDate = useWatch({ control, name: 'startDate' })

  return (
    <form id="reschedule-tournament-form" onSubmit={handleSubmit(onSubmit)} noValidate className="mt-3 space-y-3">
      <div>
        <label htmlFor="rescheduleStart" className={labelClass}>
          Start date
        </label>
        <input
          id="rescheduleStart"
          type="date"
          min={tournament.lastRegistrationDate > todayISO() ? tournament.lastRegistrationDate : todayISO()}
          className={inputClass(errors.startDate)}
          {...register('startDate', rescheduleStartValidation(tournament.lastRegistrationDate))}
        />
        <FieldError error={errors.startDate} />
      </div>
      <div>
        <label htmlFor="rescheduleEnd" className={labelClass}>
          End date
        </label>
        <input
          id="rescheduleEnd"
          type="date"
          min={startDate || todayISO()}
          className={inputClass(errors.endDate)}
          {...register('endDate', endDateValidation(() => getValues('startDate')))}
        />
        <FieldError error={errors.endDate} />
      </div>
      <div className="flex gap-2">
        <ModalFooter
          form="reschedule-tournament-form"
          cancelLabel="Back"
          onCancel={onBack}
          cancelDisabled={busy}
          confirmDisabled={busy}
          confirmLabel={busy ? 'Saving…' : 'Save dates'}
        />
      </div>
    </form>
  )
}

export default ManageRescheduleForm
