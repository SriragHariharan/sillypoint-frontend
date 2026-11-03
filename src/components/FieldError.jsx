function FieldError({ error }) {
  if (!error) return null
  return <p className="mt-1.5 text-xs font-medium text-red-600">{error.message}</p>
}

export default FieldError
