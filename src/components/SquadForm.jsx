import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { squadDefaults } from '../lib/squad'
import SquadColumn from './SquadColumn'

function SquadForm({ squads, saving, backTo, onSave }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: squadDefaults(squads) })

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate>
      <div className="grid grid-cols-2 items-start gap-2 sm:gap-6">
        <SquadColumn side="teamA" team={squads.teamA.team} register={register} control={control} errors={errors} />
        <SquadColumn side="teamB" team={squads.teamB.team} register={register} control={control} errors={errors} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-6">
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
