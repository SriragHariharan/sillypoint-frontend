import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'
import OtpInput from '../components/OtpInput'
import { useCountdown } from '../hooks/useCountdown'
import { formatTime } from '../lib/formatTime'
import { useAuthStore } from '../store/authStore'
import { otpValidation } from '../lib/validators'

function VerifyOtpPage() {
  const mobile = useAuthStore((state) => state.mobile)
  const otpExpiresAt = useAuthStore((state) => state.otpExpiresAt)
  const resendAvailableAt = useAuthStore((state) => state.resendAvailableAt)
  const login = useAuthStore((state) => state.login)
  const restartOtpTimers = useAuthStore((state) => state.restartOtpTimers)
  const [verified, setVerified] = useState(false)

  const expirySeconds = useCountdown(otpExpiresAt)
  const resendSeconds = useCountdown(resendAvailableAt)
  const expired = expirySeconds === 0

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { otp: '' } })

  const onSubmit = () => {
    login({ mobile })
    setVerified(true)
  }

  const onResend = () => {
    restartOtpTimers()
    reset({ otp: '' })
  }

  if (verified) {
    return (
      <AuthLayout title="Welcome" subtitle="You're logged in.">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Logged in successfully with +91 {mobile || '—'}.
        </p>
      </AuthLayout>
    )
  }

  if (!mobile || !otpExpiresAt) {
    return <Navigate to="/login" replace />
  }

  return (
    <AuthLayout title="Verify OTP" subtitle={`Enter the 4-digit code sent to +91 ${mobile}.`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">OTP</label>
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
          className={`text-sm font-medium ${expired ? 'text-red-600' : 'text-gray-600'}`}
        >
          {expired ? (
            'OTP expired. Request a new code.'
          ) : (
            <>
              Code expires in <span className="font-bold text-gray-900">{formatTime(expirySeconds)}</span>
            </>
          )}
        </p>

        <button
          type="submit"
          disabled={expired}
          className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
        >
          Verify OTP
        </button>
      </form>

      <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
        Please don&apos;t refresh or close this page while verifying your OTP.
      </p>

      <button
        type="button"
        onClick={onResend}
        disabled={resendSeconds > 0}
        className="mt-5 w-full text-center text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:font-medium disabled:text-gray-400 disabled:hover:text-gray-400"
      >
        {resendSeconds > 0 ? `Resend OTP in ${formatTime(resendSeconds)}` : 'Resend OTP'}
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
