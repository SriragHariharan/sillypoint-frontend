import { Children, useEffect, useRef, useState } from 'react'
import { SQUAD_SIZE } from '../lib/squad'
import Avatar from './Avatar'

const slideTo = (track, index) => {
  const card = track?.children[index]
  if (card) track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' })
}

function SquadSlider({ tabs, goTo, children }) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (goTo.nonce) slideTo(trackRef.current, goTo.index)
  }, [goTo])

  const onScroll = (event) => {
    const track = event.currentTarget
    const max = track.scrollWidth - track.clientWidth
    setActive(max > 0 ? Math.round((track.scrollLeft / max) * (tabs.length - 1)) : 0)
  }

  return (
    <div>
      <div role="tablist" className="sticky top-0 z-10 -mx-3 mb-3 grid grid-cols-2 gap-2 bg-gray-50 px-3 py-2 sm:hidden">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => slideTo(trackRef.current, index)}
            className={`relative flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition ${
              active === index ? 'border-red-600 bg-red-600 text-white shadow-sm' : 'border-gray-300 bg-white text-gray-800'
            }`}
          >
            <Avatar src={tab.logo} name={tab.label} size="xs" rounded="rounded-lg" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold leading-tight">{tab.label}</span>
              <span className={`block text-xs ${active === index ? 'text-red-100' : 'text-gray-500'}`}>
                {tab.count}/{SQUAD_SIZE} players
              </span>
            </span>
            {tab.invalid && (
              <span
                aria-label="Needs attention"
                className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-600"
              />
            )}
          </button>
        ))}
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="relative flex snap-x snap-mandatory items-start gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible"
      >
        {Children.map(children, (child) => (
          <div className="w-full shrink-0 snap-center sm:min-w-0 sm:shrink">{child}</div>
        ))}
      </div>
    </div>
  )
}

export default SquadSlider
