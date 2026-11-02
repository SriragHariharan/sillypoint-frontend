import AddTeamButton from './AddTeamButton'

function MobileAddTeamBar({ onClick, disabled }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-5 py-3 backdrop-blur sm:hidden">
      <AddTeamButton onClick={onClick} disabled={disabled} className="w-full" />
    </div>
  )
}

export default MobileAddTeamBar
