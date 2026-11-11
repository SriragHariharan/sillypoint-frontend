import { useState } from 'react'
import { playersOf } from '../lib/scoringTeams'
import BallSheet from './BallSheet'
import ConfirmModal from './ConfirmModal'
import RetireModal from './RetireModal'
import RunPad from './RunPad'
import WicketModal from './WicketModal'

const WICKET = 'wicket'
const RETIRE = 'retire'
const END = 'end'

function ScoringControls({ scoring, current, players }) {
  const [sheet, setSheet] = useState(null)
  const { busy } = scoring
  const creaseReady = current.pending !== 'batter'
  const blocked = busy || current.pending !== null || current.status !== 'in_progress'

  const close = () => setSheet(null)
  const finishWith = async (request) => {
    if (await request()) close()
  }

  const tapRuns = (runs) =>
    scoring.ball({ runs, isBoundary: runs === 4 || runs === 6, overthrowRuns: 0, extra: null, wicket: null })

  return (
    <>
      <RunPad
        disabled={blocked}
        canUndo={current.canUndo && !busy}
        freeHit={current.isFreeHit}
        endDisabled={busy || current.status !== 'in_progress'}
        onRun={tapRuns}
        onOpen={setSheet}
        onWicket={() => setSheet(WICKET)}
        onUndo={scoring.undo}
        onRetire={() => setSheet(RETIRE)}
        onEnd={() => setSheet(END)}
      />

      {sheet === WICKET && creaseReady && (
        <WicketModal
          current={current}
          fielders={playersOf(players, current.bowlingTeamId, null)}
          busy={busy}
          onClose={close}
          onSubmit={(payload) => finishWith(() => scoring.ball(payload))}
        />
      )}
      {sheet === RETIRE && creaseReady && (
        <RetireModal
          current={current}
          busy={busy}
          onClose={close}
          onSubmit={(playerId, type) => finishWith(() => scoring.retire(playerId, type))}
        />
      )}
      {sheet === END && (
        <ConfirmModal
          title={current.number === 2 ? 'End the match?' : 'End this innings?'}
          message={
            current.number === 2
              ? 'The match ends with the score as it is now and the result becomes final. It cannot be undone.'
              : 'The innings will be closed with the score as it is now. You can still undo the last ball afterwards.'
          }
          confirmLabel={current.number === 2 ? 'End match' : 'End innings'}
          busy={busy}
          onClose={close}
          onConfirm={() => finishWith(scoring.finish)}
        />
      )}
      {sheet && ![WICKET, RETIRE, END].includes(sheet) && creaseReady && (
        <BallSheet
          key={sheet}
          mode={sheet}
          current={current}
          busy={busy}
          onClose={close}
          onSubmit={(payload) => finishWith(() => scoring.ball(payload))}
        />
      )}
    </>
  )
}

export default ScoringControls
