import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm, useWatch } from 'react-hook-form'
import AppNavbar from '../components/AppNavbar'
import FieldError from '../components/FieldError'
import RichTextEditor from '../components/RichTextEditor'
import TournamentDateFields from '../components/TournamentDateFields'
import TournamentMoneyFields from '../components/TournamentMoneyFields'
import TournamentSquadSizeFields from '../components/TournamentSquadSizeFields'
import { getErrorMessage } from '../lib/api'
import { inputClass, labelClass } from '../lib/formStyles'
import { notifyError, notifyInfo } from '../lib/notify'
import { MAX_PLAYERS_PER_SIDE, MAX_SUBSTITUTES_PER_SIDE } from '../lib/squad'
import { createTournament } from '../lib/tournamentApi'
import {
  DESCRIPTION_MAX_LENGTH,
  descriptionValidation,
  htmlTextLength,
  locationValidation,
  tournamentNameValidation,
  validateLogo,
} from '../lib/validators'

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
      registrationFee: '0',
      prizeMoney: '0',
      playersPerSide: String(MAX_PLAYERS_PER_SIDE),
      substitutesPerSide: String(MAX_SUBSTITUTES_PER_SIDE),
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
    <div className="min-h-screen bg-white pb-16 sm:bg-gray-50 sm:pb-0">
      <AppNavbar />
      <main className="mx-auto w-full max-w-md px-5 py-6 sm:max-w-lg sm:py-10">
        <div className="sm:rounded-2xl sm:border sm:border-gray-200 sm:bg-white sm:p-8 sm:shadow-xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Create tournament</h1>
          <p className="mt-2 text-sm text-gray-600">Fill in the details to set up your tournament.</p>
          <div className="mt-6">
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

              <TournamentDateFields register={register} errors={errors} getValues={getValues} startDate={startDate} />

              <TournamentMoneyFields register={register} errors={errors} />

              <TournamentSquadSizeFields register={register} errors={errors} />

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
              >
                {submitting ? 'Creating…' : 'Create tournament'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddTournamentPage
