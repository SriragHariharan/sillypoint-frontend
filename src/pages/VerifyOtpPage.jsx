import { Clock } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'
import OtpInput from '../components/OtpInput'
import { useCountdown } from '../hooks/useCountdown'
import { getErrorMessage } from '../lib/api'
import { resendOtp, verifyOtp } from '../lib/authApi'
import { formatTime } from '../lib/formatTime'
import { labelClass } from '../lib/formStyles'
import { notifyError, notifyInfo } from '../lib/notify'
import { primaryButtonClass, secondaryButtonClass } from '../lib/premiumStyles'
import { setSessionFlag } from '../lib/sessionFlag'
import { useAuthStore } from '../store/authStore'
import { otpValidation } from '../lib/validators'

function VerifyOtpPage() {
  const navigate = useNavigate()
  const mobile = useAuthStore((state) => state.mobile)
  const userId = useAuthStore((state) => state.userId)
  const purpose = useAuthStore((state) => state.purpose)
  const otpExpiresAt = useAuthStore((state) => state.otpExpiresAt)
  const resendAvailableAt = useAuthStore((state) => state.resendAvailableAt)
  const status = useAuthStore((state) => state.status)
  const setSession = useAuthStore((state) => state.setSession)
  const restartOtpTimers = useAuthStore((state) => state.restartOtpTimers)

  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const expirySeconds = useCountdown(otpExpiresAt)
  const resendSeconds = useCountdown(resendAvailableAt)
  const expired = expirySeconds === 0

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { otp: '' } })

  const onSubmit = async ({ otp }) => {
    setSubmitting(true)

    try {
      const data = await verifyOtp({ userId, otp, purpose })
      setSessionFlag()
      setSession({ user: data.user, accessToken: data.accessToken })
      navigate('/home', { replace: true })
    } catch (error) {
      notifyError(getErrorMessage(error))
      reset({ otp: '' })
    } finally {
      setSubmitting(false)
    }
  }

  const onResend = async () => {
    setResending(true)

    try {
      const { resendsLeft } = await resendOtp({ userId, purpose })
      restartOtpTimers()
      reset({ otp: '' })
      notifyInfo(`New OTP sent. ${resendsLeft} ${resendsLeft === 1 ? 'resend' : 'resends'} left.`)
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setResending(false)
    }
  }

  if (status === 'authenticated') {
    return <Navigate to="/home" replace />
  }

  if (!mobile || !userId || !purpose || !otpExpiresAt) {
    return <Navigate to="/login" replace />
  }

  return (
    <AuthLayout
      eyebrow="Verify your number"
      title="Verify OTP"
      subtitle={`Enter the 4-digit code sent to +91 ${mobile} on WhatsApp.`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label className={labelClass}>OTP</label>
          <Controller
            name="otp"
            control={control}
            rules={otpValidation}
            render={({ field }) => (
              <OtpInput
                value={field.value}
                onChange={field.onChange}
                error={!!errors.otp}
                name="otp"
                autoFocus
              />
            )}
          />
          {errors.otp && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.otp.message}</p>
          )}
        </div>

        <p
          role="timer"
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${
            expired ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
          {expired ? (
            'OTP expired. Request a new code.'
          ) : (
            <>
              Code expires in <span className="font-bold text-gray-900">{formatTime(expirySeconds)}</span>
            </>
          )}
        </p>

        <button type="submit" disabled={expired || submitting} className={`w-full ${primaryButtonClass}`}>
          {submitting ? 'Verifying…' : 'Verify OTP'}
        </button>
      </form>

      <p className="mt-5 rounded-2xl border border-red-100 bg-red-50/60 px-4 py-3 text-xs font-medium text-red-700">
        Please don&apos;t refresh or close this page while verifying your OTP.
      </p>

      <button
        type="button"
        onClick={onResend}
        disabled={resendSeconds > 0 || resending}
        className={`mt-5 w-full ${secondaryButtonClass}`}
      >
        {resending
          ? 'Sending…'
          : resendSeconds > 0
            ? `Resend OTP in ${formatTime(resendSeconds)}`
            : 'Resend OTP'}
      </button>

      <p className="mt-2 text-center text-sm text-gray-600">
        <Link to="/login" className="font-semibold text-red-600 hover:text-red-700">
          Change mobile number
        </Link>
      </p>
    </AuthLayout>
  )
}

export default VerifyOtpPage
