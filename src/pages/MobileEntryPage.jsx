import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'
import { getErrorMessage } from '../lib/api'
import { requestOtp } from '../lib/authApi'
import { notifyError } from '../lib/notify'
import { useAuthStore } from '../store/authStore'
import { mobileValidation } from '../lib/validators'

function MobileEntryPage() {
  const navigate = useNavigate()
  const startOtp = useAuthStore((state) => state.startOtp)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { mobile: '' } })

  const onSubmit = async ({ mobile }) => {
    setSubmitting(true)

    try {
      const { userId, purpose } = await requestOtp(mobile)
      startOtp({ mobile, userId, purpose })
      navigate('/verify-otp')
    } catch (error) {
      notifyError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Log in or sign up"
      subtitle="Enter your mobile number and we'll send you an OTP."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium text-gray-700">
            Mobile number
          </label>
          <div
            className={`flex items-center overflow-hidden rounded-xl border focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100 ${
              errors.mobile ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <span className="border-r border-gray-300 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-600">
              +91
            </span>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="98765 43210"
              className="w-full px-3 py-3 text-sm text-gray-900 outline-none"
              {...register('mobile', mobileValidation)}
            />
          </div>
          {errors.mobile && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.mobile.message}</p>
          )}
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-xs font-medium text-gray-700">
            Your OTP and tournament notifications will be sent to this mobile number on WhatsApp.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
        >
          {submitting ? 'Sending OTP…' : 'Request OTP'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default MobileEntryPage
