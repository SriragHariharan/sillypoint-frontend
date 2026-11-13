import { Info } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'
import DemoLoginPanel from '../components/DemoLoginPanel'
import { getErrorMessage } from '../lib/api'
import { requestOtp } from '../lib/authApi'
import { fieldAddonClass, fieldGroupClass, labelClass } from '../lib/formStyles'
import { notifyError } from '../lib/notify'
import { infoNoteClass, primaryButtonClass } from '../lib/premiumStyles'
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
      eyebrow="Welcome to Sillypoint"
      title="Log in or sign up"
      subtitle="Enter your mobile number and we'll send you an OTP."
      footer={<DemoLoginPanel />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="mobile" className={labelClass}>
            Mobile number
          </label>
          <div className={fieldGroupClass(Boolean(errors.mobile))}>
            <span className={fieldAddonClass}>+91</span>
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

        <div className={`flex items-start gap-3 ${infoNoteClass}`}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm">
            <Info className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="pt-1 text-xs font-medium text-gray-700">
            OTP delivery by SMS is turned off in this demo. Use a demo account below to look around.
          </p>
        </div>

        <button type="submit" disabled={submitting} className={`w-full ${primaryButtonClass}`}>
          {submitting ? 'Sending OTP…' : 'Request OTP'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default MobileEntryPage
