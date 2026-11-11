import { useEffect, useMemo, useRef } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { labelClass } from '../lib/formStyles'
import { validateLogo } from '../lib/validators'
import Avatar from './Avatar'
import FieldError from './FieldError'

function LogoField({ control, setValue, error, label, currentLogo = null, removeLabel = 'Remove logo' }) {
  const inputRef = useRef(null)
  const logo = useWatch({ control, name: 'logo' })
  const preview = useMemo(() => (logo ? URL.createObjectURL(logo) : null), [logo])

  useEffect(() => {
    if (!preview) return undefined
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  const remove = () => {
    setValue('logo', null, { shouldValidate: true })
    if (inputRef.current) inputRef.current.value = ''
  }

  const shown = preview && !error ? preview : currentLogo

  return (
    <div>
      <label htmlFor="logo" className={labelClass}>
        {label} <span className="font-normal text-gray-500">(optional)</span>
      </label>
      <Controller
        name="logo"
        control={control}
        rules={{ validate: validateLogo }}
        render={({ field }) => (
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            {shown && <Avatar src={shown} name={label} rounded="rounded-xl" />}
            <div className="min-w-0 flex-1">
              <input
                id="logo"
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => field.onChange(event.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-red-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-red-700 hover:file:bg-red-100"
              />
              {field.value && (
                <button
                  type="button"
                  onClick={remove}
                  className="mt-2 text-xs font-medium text-gray-500 transition hover:text-red-600"
                >
                  {removeLabel}
                </button>
              )}
            </div>
          </div>
        )}
      />
      <p className="mt-1.5 text-xs text-gray-500">PNG, JPG or WebP, up to 2 MB.</p>
      <FieldError error={error} />
    </div>
  )
}

export default LogoField
