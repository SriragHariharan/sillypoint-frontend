import { useForm } from 'react-hook-form'
import { inputClass, labelClass } from '../lib/formStyles'
import { prizeMoneyValidation } from '../lib/validators'
import FieldError from './FieldError'
import ModalFooter from './ModalFooter'

function ManagePrizeForm({ tournament, busy, onSubmit, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { prizeMoney: String(tournament.prizeMoney) } })

  return (
    <form id="prize-money-form" onSubmit={handleSubmit(onSubmit)} noValidate className="mt-3 space-y-3">
      <div>
        <label htmlFor="editPrizeMoney" className={labelClass}>
          Prize money (₹)
        </label>
        <input
          id="editPrizeMoney"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          className={inputClass(errors.prizeMoney)}
          {...register('prizeMoney', prizeMoneyValidation)}
        />
        <FieldError error={errors.prizeMoney} />
      </div>
      <div className="flex gap-2">
        <ModalFooter
          form="prize-money-form"
          cancelLabel="Back"
          onCancel={onBack}
          cancelDisabled={busy}
          confirmDisabled={busy}
          confirmLabel={busy ? 'Saving…' : 'Save'}
        />
      </div>
    </form>
  )
}

export default ManagePrizeForm
