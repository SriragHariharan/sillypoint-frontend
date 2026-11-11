import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import HeroHud from './HeroHud'

const LOOP = '10s'
const RED = '#a6192e'
const CX = 300
const CY = 300
const ROPE_RADIUS = 270
const LANDING = { x: 473.6, y: 93.2 }
const BALL_PATH = 'M300 196 L300 392 Q470 300 473.6 93.2'

const STRIPES = [290, 255, 220, 185, 150, 115, 80]
const GLOW_ARC = 'M401.1 49.7 A270 270 0 0 1 529 156.9'

const polar = (radius, degrees) => [
  CX + radius * Math.cos((degrees * Math.PI) / 180),
  CY + radius * Math.sin((degrees * Math.PI) / 180),
]

const FIELDERS = [
  [190, -140],
  [205, -110],
  [215, -20],
  [180, 15],
  [205, 60],
  [190, 100],
  [205, 135],
  [185, 170],
  [200, -165],
].map(([radius, degrees]) => polar(radius, degrees))

const TRAIL = [
  { delay: 0.14, opacity: 0.16, radius: 6 },
  { delay: 0.07, opacity: 0.34, radius: 7.5 },
  { delay: 0, opacity: 1, radius: 9.5 },
]

function BallShape({ radius }) {
  return (
    <>
      <circle r={radius} fill="#c21f37" stroke="#ffffff" strokeWidth="1" />
      <path d="M-4 -3 Q-1 0 -4 3 M4 -3 Q1 0 4 3" fill="none" stroke="#ffffff" strokeWidth="1" transform={`scale(${radius / 7})`} />
    </>
  )
}

function Ground({ still }) {
  const loop = (attributeName, values, keyTimes, begin = '0s') =>
    still ? null : (
      <animate attributeName={attributeName} values={values} keyTimes={keyTimes} dur={LOOP} begin={begin} repeatCount="indefinite" />
    )

  return (
    <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" role="presentation">
      <defs>
        <radialGradient id="hero-vignette" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#6b7280" stopOpacity="0" />
          <stop offset="100%" stopColor="#6b7280" stopOpacity="0.18" />
        </radialGradient>
        <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {STRIPES.map((radius, index) => (
        <circle key={radius} cx={CX} cy={CY} r={radius} fill={index % 2 === 0 ? '#f3f4f6' : '#fafafa'} />
      ))}
      <circle cx={CX} cy={CY} r="290" fill="url(#hero-vignette)" />

      <g className="origin-center animate-orbit motion-reduce:animate-none [transform-box:fill-box]">
        <circle cx={CX} cy={CY} r="294" fill="none" stroke="#9ca3af" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="2 12" />
      </g>
      <circle cx={CX} cy={CY} r="150" fill="none" stroke="#9ca3af" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="6 8" />
      <circle cx={CX} cy={CY} r={ROPE_RADIUS} fill="none" stroke={RED} strokeWidth="4" />

      <path d={GLOW_ARC} fill="none" stroke="#dd5964" strokeWidth="9" strokeLinecap="round" filter="url(#hero-glow)" opacity={still ? 0.9 : 0}>
        {loop('opacity', '0;0;1;0.35;0;0', '0;0.32;0.34;0.5;0.6;1')}
      </path>

      <rect x="270" y="185" width="60" height="230" rx="4" fill="#ffffff" fillOpacity="0.95" stroke="#d1d5db" strokeOpacity="1" />
      <g stroke="#6b7280" strokeOpacity="0.6" strokeWidth="1.5">
        <line x1="262" y1="215" x2="338" y2="215" />
        <line x1="262" y1="385" x2="338" y2="385" />
      </g>
      <g stroke="#374151" strokeOpacity="0.9" strokeWidth="1.5">
        {[292, 300, 308].map((x) => (
          <g key={x}>
            <line x1={x} y1="184" x2={x} y2="194" />
            <line x1={x} y1="406" x2={x} y2="416" />
          </g>
        ))}
      </g>

      {FIELDERS.map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r="5" fill="#6b7280" opacity="0.4">
          {still ? null : (
            <animate attributeName="opacity" values="0.22;0.6;0.22" dur="4s" begin={`${(index * 0.45).toFixed(2)}s`} repeatCount="indefinite" />
          )}
        </circle>
      ))}

      <circle cx="300" cy={still ? 192 : 150} r="7" fill="#111827">
        {loop('cy', '150;192;192;150;150', '0;0.1;0.6;0.7;1')}
      </circle>
      <circle cx="313" cy="398" r="7" fill="#a6192e" />

      <circle cx="300" cy="396" r="0" fill="none" stroke="#9ca3af" strokeWidth="3" opacity="0">
        {loop('r', '0;0;30;30', '0;0.2;0.27;1')}
        {loop('opacity', '0;0.9;0;0', '0;0.2;0.27;1')}
      </circle>

      {[0, 0.045].map((offset, index) => (
        <circle key={index} cx={LANDING.x} cy={LANDING.y} r="0" fill="none" stroke="#dd5964" strokeWidth={index === 0 ? 4 : 2} opacity="0">
          {loop('r', '0;0;80;80', `0;${0.32 + offset};${0.5 + offset};1`)}
          {loop('opacity', '0;0.9;0;0', `0;${0.32 + offset};${0.5 + offset};1`)}
        </circle>
      ))}

      {still ? (
        <g transform={`translate(${LANDING.x} ${LANDING.y})`}>
          <BallShape radius={9.5} />
        </g>
      ) : (
        TRAIL.map(({ delay, opacity, radius }) => (
          <g key={delay} opacity="0" style={{ filter: delay === 0 ? 'drop-shadow(0 0 6px rgba(194, 31, 55, 0.55))' : undefined }}>
            <animateMotion
              dur={LOOP}
              begin={`${delay}s`}
              repeatCount="indefinite"
              calcMode="linear"
              path={BALL_PATH}
              keyPoints="0;0;0.35;1;1"
              keyTimes="0;0.1;0.2;0.32;1"
            />
            <animate
              attributeName="opacity"
              values={`0;0;${opacity};${opacity};0;0`}
              keyTimes="0;0.095;0.1;0.36;0.42;1"
              dur={LOOP}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <BallShape radius={radius} />
          </g>
        ))
      )}

      <g transform="translate(425 150)">
        <g>
          {still ? null : (
            <animateTransform attributeName="transform" type="scale" values="0;0;1.25;1;1;0;0" keyTimes="0;0.32;0.36;0.4;0.62;0.68;1" dur={LOOP} repeatCount="indefinite" />
          )}
          <text textAnchor="middle" fontSize="46" fontWeight="900" fill={RED} stroke="#ffffff" strokeWidth="4" paintOrder="stroke" letterSpacing="2">
            SIX
          </text>
        </g>
      </g>
    </svg>
  )
}

function HeroGround() {
  const still = usePrefersReducedMotion()

  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <Ground still={still} />
      <HeroHud />
    </div>
  )
}

export default HeroGround
