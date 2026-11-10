import { useState } from 'react'
import { predictCrease, totalRunsOf } from '../lib/scoringRules'
import ChoiceGrid from './ChoiceGrid'
import ModalShell from './ModalShell'

const BALL_TYPES = [
  { value: 'normal', label: 'Off the bat' },
  { value: 'bye', label: 'Bye' },
  { value: 'leg_bye', label: 'Leg bye' },
  { value: 'wide', label: 'Wide' },
  { value: 'no_ball', label: 'No ball' },
]
const RUN_KINDS = [
  { value: 'bat', label: 'Off the bat' },
  { value: 'bye', label: 'Byes' },
  { value: 'leg_bye', label: 'Leg byes' },
]
const OVERTHROWS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4 (boundary)' },
]
const TITLES = { wide: 'Wide', no_ball: 'No ball', bye: 'Byes', leg_bye: 'Leg byes', overthrow: 'Overthrow' }

const options = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => ({ value: from + index, label: String(from + index) }))

function BallSheet({ mode, current, busy, onClose, onSubmit }) {
  const isOverthrowMode = mode === 'overthrow'
  const [ballType, setBallType] = useState(isOverthrowMode ? 'normal' : mode)
  const [runKind, setRunKind] = useState('bat')
  const [runs, setRuns] = useState(mode === 'bye' || mode === 'leg_bye' ? 1 : 0)
  const [hitBoundary, setHitBoundary] = useState(false)
  const [overthrow, setOverthrow] = useState(isOverthrowMode ? 1 : 0)

  const hasOverthrow = overthrow > 0
  const batRuns = ballType === 'normal' || (ballType === 'no_ball' && runKind === 'bat')
  const maxRuns = hasOverthrow ? 3 : ballType === 'wide' ? 5 : batRuns ? 6 : 5
  const minRuns = ballType === 'bye' || ballType === 'leg_bye' ? (hasOverthrow ? 0 : 1) : 0
  const safeRuns = Math.min(Math.max(runs, minRuns), maxRuns)
  const isBoundary = hasOverthrow ? overthrow === 4 : safeRuns === 6 || (safeRuns === 4 && hitBoundary)

  const payload = {
    runs: safeRuns + overthrow,
    isBoundary,
    overthrowRuns: overthrow,
    extra: ballType === 'normal' ? null : { type: ballType, runKind: ballType === 'no_ball' ? runKind : 'bat' },
    wicket: null,
  }
  const next = predictCrease(current, payload)
  const canSave = payload.runs > 0 || ballType === 'wide' || ballType === 'no_ball'

  return (
    <ModalShell
      title={TITLES[mode]}
      subtitle={isOverthrowMode ? 'Runs after the fielder threw the ball' : undefined}
      onClose={busy ? undefined : onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(payload)}
            disabled={busy || !canSave}
            className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save ball'}
          </button>
        </>
      }
    >
      {isOverthrowMode && <ChoiceGrid label="Type of ball" options={BALL_TYPES} value={ballType} onChange={setBallType} columns={5} />}

      {ballType === 'no_ball' && <ChoiceGrid label="Runs scored were" options={RUN_KINDS} value={runKind} onChange={setRunKind} columns={3} />}

      <ChoiceGrid
        label={hasOverthrow ? 'Runs the batters completed before the throw' : ballType === 'wide' ? 'Extra runs run on the wide' : 'Runs'}
        options={options(minRuns, maxRuns)}
        value={safeRuns}
        onChange={(value) => {
          setRuns(value)
          setHitBoundary(value === 4)
        }}
        columns={options(minRuns, maxRuns).length > 5 ? 7 : 4}
      />

      {!hasOverthrow && safeRuns === 4 && (
        <ChoiceGrid
          label="Did the ball reach the boundary?"
          options={[
            { value: true, label: 'Yes, four' },
            { value: false, label: 'No, they ran 4' },
          ]}
          value={hitBoundary}
          onChange={setHitBoundary}
          columns={2}
        />
      )}

      <ChoiceGrid
        label={isOverthrowMode ? 'Overthrow runs' : 'Add an overthrow?'}
        options={isOverthrowMode ? OVERTHROWS : [{ value: 0, label: 'No' }, ...OVERTHROWS]}
        value={overthrow}
        onChange={setOverthrow}
        columns={isOverthrowMode ? 4 : 5}
      />

      <p className="rounded-xl bg-gray-50 px-3 py-3 text-sm text-gray-700">
        <span className="font-semibold text-gray-900">{totalRunsOf(payload)} {totalRunsOf(payload) === 1 ? 'run' : 'runs'}</span> from this ball.{' '}
        {next?.striker ? `${next.striker.name} will be on strike.` : 'A new batter will be chosen next.'}
      </p>
    </ModalShell>
  )
}

export default BallSheet
