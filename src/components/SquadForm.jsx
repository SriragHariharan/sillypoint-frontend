import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { SIDES, filledCount, squadDefaults } from '../lib/squad'
import SquadColumn from './SquadColumn'
import SquadSlider from './SquadSlider'

function SquadForm({ squads, limits, saving, backTo, onSave }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: squadDefaults(squads, limits) })
  const [goTo, setGoTo] = useState({ index: 0, nonce: 0 })
  const watched = useWatch({ control, name: SIDES })

  const tabs = SIDES.map((side, index) => ({
    label: squads[side].team.name,
    logo: squads[side].team.logo,
    count: filledCount(watched[index]),
    invalid: Boolean(errors[side]),
  }))

  const showFirstError = (formErrors) =>
    setGoTo((current) => ({ index: Math.max(0, SIDES.findIndex((side) => formErrors[side])), nonce: current.nonce + 1 }))

  return (
    <form onSubmit={handleSubmit(onSave, showFirstError)} noValidate>
      <SquadSlider tabs={tabs} total={limits.total} goTo={goTo}>
        {SIDES.map((side) => (
          <SquadColumn
            key={side}
            side={side}
            team={squads[side].team}
            total={limits.total}
            register={register}
            control={control}
            errors={errors}
          />
        ))}
      </SquadSlider>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link
            to={backTo}
            className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-600"
          >
            {saving ? 'Saving…' : 'Save players'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default SquadForm
