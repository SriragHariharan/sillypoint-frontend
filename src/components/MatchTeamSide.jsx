import Avatar from './Avatar'

function MatchTeamSide({ team, onDark = false }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
      <Avatar src={team.logo} name={team.name} size="lg" rounded="rounded-2xl" />
      <span className={`w-full break-words text-base font-black sm:text-lg ${onDark ? 'text-white' : 'text-gray-900'}`}>
        {team.name}
      </span>
    </div>
  )
}

export default MatchTeamSide
