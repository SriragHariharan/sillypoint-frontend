import { useForm } from 'react-hook-form'
import { inputClass, labelClass } from '../lib/formStyles'
import { primaryButtonClass } from '../lib/premiumStyles'
import {
  managerMobileValidation,
  managerNameValidation,
  teamNameValidation,
} from '../lib/validators'
import FieldError from './FieldError'
import LogoField from './LogoField'

function TeamForm({ team, submitting, submitLabel, submittingLabel, onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: team?.name ?? '',
      managerName: team?.manager_name ?? '',
      managerMobile: team?.manager_mobile ?? '',
      logo: null,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className={labelClass}>
          Team name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Tigers"
          className={inputClass(errors.name)}
          {...register('name', teamNameValidation)}
        />
        <FieldError error={errors.name} />
      </div>

      <LogoField
        control={control}
        setValue={setValue}
        error={errors.logo}
        label="Team logo"
        currentLogo={team?.logo}
        removeLabel={team?.logo ? 'Keep current logo' : 'Remove logo'}
      />

      <div>
        <label htmlFor="managerName" className={labelClass}>
          Team manager name
        </label>
        <input
          id="managerName"
          type="text"
          placeholder="Rahul"
          className={inputClass(errors.managerName)}
          {...register('managerName', managerNameValidation)}
        />
        <FieldError error={errors.managerName} />
      </div>

      <div>
        <label htmlFor="managerMobile" className={labelClass}>
          Team manager mobile (WhatsApp)
        </label>
        <input
          id="managerMobile"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="9876543210"
          className={inputClass(errors.managerMobile)}
          {...register('managerMobile', managerMobileValidation)}
        />
        <p className="mt-1.5 text-xs text-gray-500">
          Team notifications will be sent to this number on WhatsApp.
        </p>
        <FieldError error={errors.managerMobile} />
      </div>

      <button type="submit" disabled={submitting} className={`w-full ${primaryButtonClass}`}>
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  )
}

export default TeamForm
