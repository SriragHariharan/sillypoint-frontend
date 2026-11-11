import { KeyRound } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { getErrorMessage } from '../lib/api'
import { fieldAddonClass, fieldGroupClass, labelClass } from '../lib/formStyles'
import { notifyError } from '../lib/notify'
import { primaryButtonClass } from '../lib/premiumStyles'
import { scorerLogin } from '../lib/scorerApi'
import { scorerPinValidation } from '../lib/validators'
import { useScorerStore } from '../store/scorerStore'

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
    <AuthLayout
      eyebrow="Scorer access"
      title="Scorer login"
      subtitle="Enter the 6-digit PIN the organizer shared with you."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="scorer-login-pin" className={labelClass}>
            PIN
          </label>
          <div className={fieldGroupClass(Boolean(errors.pin))}>
            <span className={fieldAddonClass}>
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            </span>
            <input
              id="scorer-login-pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoComplete="off"
              placeholder="6-digit PIN"
              className="w-full bg-transparent px-3 py-3 text-sm tracking-[0.3em] text-gray-900 outline-none placeholder:tracking-normal"
              {...register('pin', scorerPinValidation)}
            />
          </div>
          {errors.pin && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.pin.message}</p>}
        </div>

        <button type="submit" disabled={submitting} className={`w-full ${primaryButtonClass}`}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ScorerLoginPage
