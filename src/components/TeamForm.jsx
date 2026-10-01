import { useEffect, useMemo, useRef } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import Avatar from './Avatar'
import {
  captainMobileValidation,
  captainNameValidation,
  teamNameValidation,
  validateLogo,
} from '../lib/validators'

const inputClass = (hasError) =>
  `w-full rounded-xl border px-3 py-3 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 ${
    hasError ? 'border-red-400' : 'border-gray-300'
  }`

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

function FieldError({ error }) {
  if (!error) return null
  return <p className="mt-1.5 text-xs font-medium text-red-600">{error.message}</p>
}

function TeamForm({ team, submitting, submitLabel, submittingLabel, onSubmit }) {
  const logoInputRef = useRef(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: team?.name ?? '',
      captainName: team?.captain_name ?? '',
      captainMobile: team?.captain_mobile ?? '',
      logo: null,
    },
  })

  const logo = useWatch({ control, name: 'logo' })
  const logoPreview = useMemo(() => (logo ? URL.createObjectURL(logo) : null), [logo])

  useEffect(() => {
    if (!logoPreview) return undefined
    return () => URL.revokeObjectURL(logoPreview)
  }, [logoPreview])

  const removeLogo = () => {
    setValue('logo', null, { shouldValidate: true })
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const shownLogo = logoPreview && !errors.logo ? logoPreview : team?.logo

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

      <div>
        <label htmlFor="logo" className={labelClass}>
          Team logo <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <Controller
          name="logo"
          control={control}
          rules={{ validate: validateLogo }}
          render={({ field }) => (
            <div className="flex items-center gap-4">
              {shownLogo && <Avatar src={shownLogo} name="Team logo" rounded="rounded-xl" />}
              <div className="min-w-0 flex-1">
                <input
                  id="logo"
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => field.onChange(event.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-red-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-red-700 hover:file:bg-red-100"
                />
                {field.value && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="mt-2 text-xs font-medium text-gray-500 transition hover:text-red-600"
                  >
                    {team?.logo ? 'Keep current logo' : 'Remove logo'}
                  </button>
                )}
              </div>
            </div>
          )}
        />
        <p className="mt-1.5 text-xs text-gray-500">PNG, JPG or WebP, up to 2 MB.</p>
        <FieldError error={errors.logo} />
      </div>

      <div>
        <label htmlFor="captainName" className={labelClass}>
          Captain name
        </label>
        <input
          id="captainName"
          type="text"
          placeholder="Rahul"
          className={inputClass(errors.captainName)}
          {...register('captainName', captainNameValidation)}
        />
        <FieldError error={errors.captainName} />
      </div>

      <div>
        <label htmlFor="captainMobile" className={labelClass}>
          Captain mobile
        </label>
        <input
          id="captainMobile"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="9876543210"
          className={inputClass(errors.captainMobile)}
          {...register('captainMobile', captainMobileValidation)}
        />
        <FieldError error={errors.captainMobile} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  )
}

export default TeamForm
