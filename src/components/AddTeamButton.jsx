function AddTeamButton({ onClick, disabled, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full bg-red-600 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      Add my team
    </button>
  )
}

export default AddTeamButton
