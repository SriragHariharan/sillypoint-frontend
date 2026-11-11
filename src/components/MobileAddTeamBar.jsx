import AddTeamButton from './AddTeamButton'
import RegistrationDeadline from './RegistrationDeadline'

function MobileAddTeamBar({ onClick, disabled, lastRegistrationDate }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/90 px-5 py-3 shadow-[0_-8px_24px_-12px_rgba(166,25,46,0.25)] backdrop-blur-xl sm:hidden">
      <RegistrationDeadline date={lastRegistrationDate} compact className="mb-2" />
      <AddTeamButton onClick={onClick} disabled={disabled} className="w-full" />
    </div>
  )
}

export default MobileAddTeamBar
