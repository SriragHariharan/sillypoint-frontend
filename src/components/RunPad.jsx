import { Undo2 } from 'lucide-react'

const RUNS = [0, 1, 2, 3, 4, 5, 6]

const EXTRAS = [
  { mode: 'wide', label: 'Wide' },
  { mode: 'no_ball', label: 'No ball' },
  { mode: 'bye', label: 'Bye' },
  { mode: 'leg_bye', label: 'Leg bye' },
]

const baseClass =
  'h-full min-h-10 rounded-xl border px-1 font-bold transition disabled:cursor-not-allowed disabled:opacity-50'
const outlineBase = `${baseClass} border-gray-300 bg-white text-gray-900 hover:border-red-600 hover:text-red-600`
const outlineClass = `${outlineBase} text-xs sm:text-sm`
const runClass = `${outlineBase} text-lg short:text-base`
const wicketClass = `${baseClass} border-red-600 bg-red-600 text-xs text-white hover:bg-red-700 sm:text-sm`

function RunPad({ disabled, canUndo, freeHit, endDisabled, onRun, onOpen, onWicket, onUndo, onRetire, onEnd }) {
  return (
    <section
      className={`grid min-h-0 flex-1 grid-cols-4 grid-rows-4 gap-1.5 rounded-2xl border bg-gray-50 p-1.5 shadow-sm max-h-[30rem] ${
        freeHit ? 'border-red-600' : 'border-gray-200'
      }`}
    >
      {RUNS.map((runs) => (
        <button key={runs} type="button" disabled={disabled} onClick={() => onRun(runs)} className={runClass}>
          {runs}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={onWicket}
        className={wicketClass}
      >
        Wicket
      </button>

      {EXTRAS.map((extra) => (
        <button key={extra.mode} type="button" disabled={disabled} onClick={() => onOpen(extra.mode)} className={outlineClass}>
          {extra.label}
        </button>
      ))}

      <button type="button" disabled={disabled} onClick={() => onOpen('overthrow')} className={outlineClass}>
        Overthrow
      </button>
      <button
        type="button"
        disabled={!canUndo}
        onClick={onUndo}
        className={`${outlineClass} flex items-center justify-center gap-1`}
      >
        <Undo2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        Undo
      </button>
      <button type="button" disabled={disabled} onClick={onRetire} className={outlineClass}>
        Retire
      </button>
      <button type="button" disabled={endDisabled} onClick={onEnd} className={outlineClass}>
        End innings
      </button>
    </section>
  )
}

export default RunPad
