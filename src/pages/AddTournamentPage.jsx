import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm, useWatch } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'
import RichTextEditor from '../components/RichTextEditor'
import { getErrorMessage } from '../lib/api'
import { notifyError, notifyInfo } from '../lib/notify'
import { createTournament } from '../lib/tournamentApi'
import {
  DESCRIPTION_MAX_LENGTH,
  descriptionValidation,
  endDateValidation,
  htmlTextLength,
  locationValidation,
  startDateValidation,
  todayISO,
  tournamentNameValidation,
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

function AddTournamentPage() {
  const navigate = useNavigate()
  const logoInputRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      logo: null,
      location: '',
      startDate: '',
      endDate: '',
    },
  })

  const logo = useWatch({ control, name: 'logo' })
  const description = useWatch({ control, name: 'description' })
  const startDate = useWatch({ control, name: 'startDate' })

  const logoPreview = useMemo(() => (logo ? URL.createObjectURL(logo) : null), [logo])

  useEffect(() => {
    if (!logoPreview) return undefined
    return () => URL.revokeObjectURL(logoPreview)
  }, [logoPreview])

  const removeLogo = () => {
    setValue('logo', null, { shouldValidate: true })
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const onSubmit = async (values) => {
    setSubmitting(true)

    try {
      const { tournament } = await createTournament(values)
      notifyInfo('Tournament created.')
      navigate(`/tournaments/${tournament.id}`)
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create tournament"
      subtitle="Fill in the details to set up your tournament."
      flatOnMobile
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className={labelClass}>
            Tournament name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Summer Premier League"
            className={inputClass(errors.name)}
            {...register('name', tournamentNameValidation)}
          />
          <FieldError error={errors.name} />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <Controller
            name="description"
            control={control}
            rules={descriptionValidation}
            render={({ field }) => (
              <RichTextEditor
                id="description"
                value={field.value}
                onChange={field.onChange}
                placeholder="Rules, format, prizes…"
              />
            )}
          />
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <div>
              <FieldError error={errors.description} />
            </div>
            <span className="ml-auto text-xs text-gray-500">
              {htmlTextLength(description)}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="logo" className={labelClass}>
            Logo <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <Controller
            name="logo"
            control={control}
            rules={{ validate: validateLogo }}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                {logoPreview && !errors.logo && (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-16 w-16 shrink-0 rounded-xl border border-gray-200 object-cover"
                  />
                )}
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
                      Remove logo
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
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="City, ground or venue"
            className={inputClass(errors.location)}
            {...register('location', locationValidation)}
          />
          <FieldError error={errors.location} />
        </div>

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

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
        >
          {submitting ? 'Creating…' : 'Create tournament'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default AddTournamentPage
