import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'
import PinInput from '../components/PinInput'
import { useAuthStore } from '../store/authStore'
import { otpValidation, pinValidation } from '../lib/validators'

function VerifyOtpPage() {
  const mobile = useAuthStore((state) => state.mobile)
  const login = useAuthStore((state) => state.login)
  const [stage, setStage] = useState('otp')
  const [done, setDone] = useState(false)

  const otpForm = useForm({ defaultValues: { otp: '' } })
  const pinForm = useForm({ defaultValues: { pin: '', confirmPin: '' } })

  const onVerifyOtp = () => {
    setStage('pin')
  }

  const onCreatePin = (data) => {
    login({ mobile, pin: data.pin })
    setDone(true)
  }

  if (done) {
    return (
      <AuthLayout title="You're all set" subtitle="Your account has been created.">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Account created for +91 {mobile || '—'}. You can now log in anytime with your mobile
          number and PIN.
        </p>
        <Link
          to="/login"
          className="mt-6 block w-full rounded-full bg-red-600 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Go to login
        </Link>
      </AuthLayout>
    )
  }

  if (stage === 'pin') {
    return (
      <AuthLayout title="Create your PIN" subtitle="Set a 4-digit PIN to secure your account.">
        <form onSubmit={pinForm.handleSubmit(onCreatePin)} className="space-y-5" noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">4-digit PIN</label>
            <Controller
              name="pin"
              control={pinForm.control}
              rules={pinValidation}
              render={({ field }) => (
                <PinInput
                  value={field.value}
                  onChange={field.onChange}
                  masked
                  error={!!pinForm.formState.errors.pin}
                  name="pin"
                />
              )}
            />
            {pinForm.formState.errors.pin && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {pinForm.formState.errors.pin.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm PIN</label>
            <Controller
              name="confirmPin"
              control={pinForm.control}
              rules={{
                required: 'Confirm your PIN',
                validate: (value) => value === pinForm.getValues('pin') || 'PINs do not match',
              }}
              render={({ field }) => (
                <PinInput
                  value={field.value}
                  onChange={field.onChange}
                  masked
                  error={!!pinForm.formState.errors.confirmPin}
                  name="confirm pin"
                />
              )}
            />
            {pinForm.formState.errors.confirmPin && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {pinForm.formState.errors.confirmPin.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Complete Signup
          </button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle={
        mobile
          ? `Enter the 4-digit code sent to +91 ${mobile}.`
          : 'Enter the 4-digit code sent to your mobile number.'
      }
    >
      <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-5" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">OTP</label>
          <Controller
            name="otp"
            control={otpForm.control}
            rules={otpValidation}
            render={({ field }) => (
              <PinInput
                value={field.value}
                onChange={field.onChange}
                error={!!otpForm.formState.errors.otp}
                name="otp"
                autoFocus
              />
            )}
          />
          {otpForm.formState.errors.otp && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {otpForm.formState.errors.otp.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Verify OTP
        </button>
      </form>

      <button
        type="button"
        disabled
        className="mt-6 w-full text-center text-sm font-medium text-gray-400"
      >
        Resend OTP
      </button>

      <p className="mt-2 text-center text-sm text-gray-600">
        <Link to="/signup" className="font-semibold text-red-600 hover:text-red-700">
          Change mobile number
        </Link>
      </p>
    </AuthLayout>
  )
}

export default VerifyOtpPage
