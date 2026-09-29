import { useRef } from 'react'

function OtpInput({ length = 4, value = '', onChange, autoFocus = false, error = false, name }) {
  const inputsRef = useRef([])

  const digits = Array.from({ length }, (_, i) => value[i] || '')

  const focusInput = (index) => {
    inputsRef.current[index]?.focus()
  }

  const handleChange = (index, rawValue) => {
    const digit = rawValue.replace(/\D/g, '').slice(-1)
    const nextDigits = [...digits]
    nextDigits[index] = digit
    onChange(nextDigits.join('').slice(0, length))
    if (digit && index < length - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      focusInput(index - 1)
    }
  }

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      event.preventDefault()
      onChange(pasted)
      focusInput(Math.min(pasted.length, length - 1))
    }
  }

  return (
    <div className="flex gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          autoFocus={autoFocus && index === 0}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          onPaste={handlePaste}
          aria-label={`${name ?? 'digit'} ${index + 1}`}
          className={`h-12 w-12 rounded-xl border text-center text-lg font-bold text-gray-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100 sm:h-14 sm:w-14 ${
            error ? 'border-red-400' : 'border-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export default OtpInput
