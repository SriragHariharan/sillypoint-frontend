import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { getErrorMessage } from '../lib/api'
import { notifyError } from '../lib/notify'
import { scorerLogin } from '../lib/scorerApi'
import { mobileValidation, scorerPinValidation } from '../lib/validators'
import { useScorerStore } from '../store/scorerStore'

const fieldClass = (hasError) =>
  `w-full rounded-xl border bg-white px-3 py-3 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 ${
    hasError ? 'border-red-400' : 'border-gray-300'
  }`

function ScorerLoginPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const setScorerSession = useScorerStore((state) => state.setScorerSession)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { mobile: '', pin: '' } })

  const onSubmit = async ({ mobile, pin }) => {
    setSubmitting(true)

    try {
      const session = await scorerLogin({ token, mobile, pin })
      setScorerSession(session)
      navigate(`/scorer/${token}/welcome`, { replace: true })
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Scorer login" subtitle="Enter your mobile number and the 6-digit PIN the organizer shared with you.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="scorer-login-mobile" className="mb-1.5 block text-sm font-medium text-gray-700">
            Mobile number
          </label>
          <div
            className={`flex items-center overflow-hidden rounded-xl border focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100 ${
              errors.mobile ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <span className="border-r border-gray-300 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-600">+91</span>
            <input
              id="scorer-login-mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              placeholder="98765 43210"
              className="w-full px-3 py-3 text-sm text-gray-900 outline-none"
              {...register('mobile', mobileValidation)}
            />
          </div>
          {errors.mobile && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.mobile.message}</p>}
        </div>

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
