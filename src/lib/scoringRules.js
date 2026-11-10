// Cricket rules used by the scoring screen. The server applies the same rules and is the source of truth;
// this copy only lets the screen flip the batters instantly while the request is on its way.

export const BALLS_PER_OVER = 6
export const MAX_RUNS_PER_BALL = 9
// An overthrow that reaches the rope is always worth four
export const OVERTHROW_BOUNDARY_RUNS = 4

export const WICKET_LABELS = {
  bowled: 'Bowled',
  caught: 'Caught',
  lbw: 'LBW',
  run_out: 'Run out',
  stumped: 'Stumped',
  hit_wicket: 'Hit wicket',
  obstructing_field: 'Obstructing the field',
}

// Dismissals that can happen at either end, so the scorer says who is out
export const EITHER_END_WICKETS = ['run_out', 'obstructing_field']
// Dismissals that need the fielder named / may name one
export const FIELDER_REQUIRED_WICKETS = ['caught', 'stumped']
export const FIELDER_ALLOWED_WICKETS = ['caught', 'stumped', 'run_out']

const ALL_WICKETS = Object.keys(WICKET_LABELS)
const WIDE_WICKETS = ['stumped', 'run_out', 'hit_wicket', 'obstructing_field']
const NO_BALL_WICKETS = ['run_out', 'obstructing_field']

// What can dismiss a batter on this kind of ball
export const wicketTypesFor = ({ ballType, isFreeHit }) => {
  if (isFreeHit || ballType === 'no_ball') return NO_BALL_WICKETS
  if (ballType === 'wide') return WIDE_WICKETS
  return ALL_WICKETS
}

export const isLegalBall = (extra) => !extra || (extra.type !== 'wide' && extra.type !== 'no_ball')

// Runs the batters physically ran: a ball (or its overthrow) that reached the rope was not run, and when an
// overthrow reached the rope only the runs before the throw were run
export const runsRunOf = ({ runs, isBoundary, overthrowRuns }) => {
  if (!isBoundary) return runs
  return overthrowRuns > 0 ? runs - overthrowRuns : 0
}

// Every run the batting side gets from the ball (the wide / no-ball penalty run included)
export const totalRunsOf = ({ runs, extra }) => runs + (extra?.type === 'wide' || extra?.type === 'no_ball' ? 1 : 0)

// Who is at the crease after the ball: odd runs run change the strike, a dismissed batter leaves an empty place,
// and at the end of an over the batters change ends again whatever the runs were.
export const predictCrease = (current, payload) => {
  let striker = current.striker
  let nonStriker = current.nonStriker
  if (!striker || !nonStriker) return null

  const wicket = payload.wicket
  const dismissedId = wicket
    ? EITHER_END_WICKETS.includes(wicket.type)
      ? wicket.dismissedPlayerId
      : striker.playerId
    : null

  if (runsRunOf(payload) % 2 === 1) [striker, nonStriker] = [nonStriker, striker]

  if (dismissedId !== null) {
    if (striker.playerId === dismissedId) striker = null
    else if (nonStriker.playerId === dismissedId) nonStriker = null
  }

  const overCompleted = isLegalBall(payload.extra) && (current.legalBalls + 1) % BALLS_PER_OVER === 0
  if (overCompleted) [striker, nonStriker] = [nonStriker, striker]

  return { striker, nonStriker }
}

// "12/3" style helpers
export const scoreText = (runs, wickets) => `${runs}/${wickets}`

export const ballsText = (balls) => (balls === 1 ? '1 ball' : `${balls} balls`)
