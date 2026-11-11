import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm, useWatch } from 'react-hook-form'
import AppFormShell from '../components/AppFormShell'
import FieldError from '../components/FieldError'
import LogoField from '../components/LogoField'
import RichTextEditor from '../components/RichTextEditor'
import TournamentDateFields from '../components/TournamentDateFields'
import TournamentMoneyFields from '../components/TournamentMoneyFields'
import TournamentSquadSizeFields from '../components/TournamentSquadSizeFields'
import { getErrorMessage } from '../lib/api'
import { inputClass, labelClass } from '../lib/formStyles'
import { notifyError, notifyInfo } from '../lib/notify'
import { primaryButtonClass } from '../lib/premiumStyles'
import { MAX_PLAYERS_PER_SIDE, MAX_SUBSTITUTES_PER_SIDE } from '../lib/squad'
import { createTournament } from '../lib/tournamentApi'
import {
  DESCRIPTION_MAX_LENGTH,
  descriptionValidation,
  htmlTextLength,
  locationValidation,
  tournamentNameValidation,
} from '../lib/validators'

function AddTournamentPage() {
  const navigate = useNavigate()
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

  const description = useWatch({ control, name: 'description' })
  const startDate = useWatch({ control, name: 'startDate' })

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
    <AppFormShell
      eyebrow="New tournament"
      title="Create tournament"
      subtitle="Fill in the details to set up your tournament."
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

        <LogoField control={control} setValue={setValue} error={errors.logo} label="Logo" />

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

        <button type="submit" disabled={submitting} className={`w-full ${primaryButtonClass}`}>
          {submitting ? 'Creating…' : 'Create tournament'}
        </button>
      </form>
    </AppFormShell>
  )
}

export default AddTournamentPage
