import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'
import { useAuthStore } from '../store/authStore'
import { mobileValidation } from '../lib/validators'

function SignupPage() {
  const navigate = useNavigate()
  const setMobile = useAuthStore((state) => state.setMobile)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { mobile: '' } })

  const onSubmit = (data) => {
    setMobile(data.mobile)
    navigate('/verify-otp')
  }

  return (
    <AuthLayout title="Create an account" subtitle="Enter your mobile number to get started.">
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

        <button
          type="submit"
          className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Request OTP
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-red-600 hover:text-red-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default SignupPage
