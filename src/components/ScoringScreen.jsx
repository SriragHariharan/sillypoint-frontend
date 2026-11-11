import { useState } from 'react'
import { teamById } from '../lib/scoringTeams'
import BowlerCard from './BowlerCard'
import CreaseCard from './CreaseCard'
import PlayerPickerModal from './PlayerPickerModal'
import ScoreHeader from './ScoreHeader'
import ScoringControls from './ScoringControls'

const oversNote = (overs) => (overs === 1 ? '1 over bowled' : `${overs} overs bowled`)

function ScoringScreen({ scoring }) {
  const { data, preview, busy } = scoring
  const { match, players, current } = data
  const [changingBowler, setChangingBowler] = useState(false)

  const batterOptions = current.availableBatters.map((batter) => ({
    id: batter.id,
    name: batter.name,
    note: batter.retiredHurt ? 'Retired hurt' : null,
  }))
  const bowlerOptions = current.availableBowlers.map((bowler) => ({
    id: bowler.id,
    name: bowler.name,
    note: oversNote(bowler.overs),
    disabledReason: bowler.disabledReason,
  }))

  const changeBowler = async (playerId) => {
    if (await scoring.pickBowler(playerId)) setChangingBowler(false)
  }

  return (
    <div className="flex h-full min-h-[18rem] flex-col gap-2 landscape:grid landscape:grid-cols-2 landscape:grid-rows-[minmax(0,1fr)] landscape:gap-3 lg:grid lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:gap-3">
      <div className="flex shrink-0 flex-col gap-2 landscape:justify-center lg:justify-center">
        <ScoreHeader current={current} teamName={teamById(match, current.battingTeamId).name} />
        <section className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <CreaseCard current={current} preview={preview} busy={busy} onSwap={scoring.swap} />
          <BowlerCard current={current} busy={busy} onChange={() => setChangingBowler(true)} />
        </section>
      </div>

      <div className="flex min-h-0 flex-1 flex-col landscape:justify-center lg:justify-center">
        <ScoringControls scoring={scoring} current={current} players={players} />
      </div>

      {current.pending === 'batter' && (
        <PlayerPickerModal
          title="Who comes in next?"
          subtitle="A batter is out. Choose the next batter to continue."
          options={batterOptions}
          busy={busy}
          onPick={scoring.pickBatter}
          onUndo={scoring.undo}
        />
      )}
      {current.pending === 'bowler' && (
        <PlayerPickerModal
          title="Choose the next bowler"
          subtitle="The over is complete. Choose who bowls the next over."
          options={bowlerOptions}
          busy={busy}
          onPick={scoring.pickBowler}
          onUndo={scoring.undo}
        />
      )}
      {changingBowler && current.pending === null && (
        <PlayerPickerModal
          title="Change the bowler"
          subtitle="No ball of this over has been bowled yet."
          options={bowlerOptions}
          busy={busy}
          onPick={changeBowler}
          onClose={() => setChangingBowler(false)}
        />
      )}
    </div>
  )
}

export default ScoringScreen
