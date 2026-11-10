import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { scorerLogin } from '../lib/scorerApi'
import { scorerPinValidation } from '../lib/validators'
import { useScorerStore } from '../store/scorerStore'

const fieldClass = (hasError) =>
  `w-full rounded-xl border bg-white px-3 py-3 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 ${
    hasError ? 'border-red-400' : 'border-gray-300'
  }`

function ScorerLoginPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const setScorerSession = useScorerStore((state) => state.setScorerSession)
  const hasSession = useScorerStore((state) => Boolean(state.accessToken) && state.linkToken === token)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { pin: '' } })

  const onSubmit = async ({ pin }) => {
    setSubmitting(true)

    try {
      const session = await scorerLogin({ token, pin })
      setScorerSession({ ...session, linkToken: token })
      navigate(`/scorer/${token}/welcome`, { replace: true })
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (hasSession) return <Navigate to={`/scorer/${token}/welcome`} replace />

  return (
    <AuthLayout title="Scorer login" subtitle="Enter the 6-digit PIN the organizer shared with you.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="scorer-login-pin" className="mb-1.5 block text-sm font-medium text-gray-700">
            PIN
          </label>
          <input
            id="scorer-login-pin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            autoComplete="off"
            placeholder="6-digit PIN"
            className={fieldClass(Boolean(errors.pin))}
            {...register('pin', scorerPinValidation)}
          />
          {errors.pin && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.pin.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ScorerLoginPage
