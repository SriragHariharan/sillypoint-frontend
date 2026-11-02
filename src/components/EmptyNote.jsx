function EmptyNote({ children }) {
  return (
    <p className="rounded-2xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-600">
      {children}
    </p>
  )
}

export default EmptyNote
