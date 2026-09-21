import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'
import PinInput from '../components/PinInput'
import { useAuthStore } from '../store/authStore'
import { mobileValidation, pinValidation } from '../lib/validators'

function LoginPage() {
  const mobile = useAuthStore((state) => state.mobile)
  const login = useAuthStore((state) => state.login)
  const [loggedIn, setLoggedIn] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: { mobile: '', pin: '' } })

  const onSubmit = (data) => {
    login(data)
    setLoggedIn(true)
  }

  if (loggedIn) {
    return (
      <AuthLayout title="Welcome back" subtitle="You're logged in.">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Logged in successfully with +91 {mobile}.
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Log in" subtitle="Enter your mobile number and PIN to continue.">
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">4-digit PIN</label>
          <Controller
            name="pin"
            control={control}
            rules={pinValidation}
            render={({ field }) => (
              <PinInput
                value={field.value}
                onChange={field.onChange}
                masked
                error={!!errors.pin}
                name="pin"
              />
            )}
          />
          {errors.pin && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.pin.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Log in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-red-600 hover:text-red-700">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
