import { primaryButtonClass } from '../lib/premiumStyles'

function AddTeamButton({ onClick, disabled, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-7 text-center disabled:cursor-wait ${primaryButtonClass} ${className}`}
    >
      Add my team
    </button>
  )
}

export default AddTeamButton
