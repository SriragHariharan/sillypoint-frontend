const overChips = ['1', '4', 'Wd', '0']

function HeroHud() {
  return (
    <>
      <div className="absolute left-0 top-0 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-300 sm:text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-white">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Live
        </span>
        <span className="hidden min-[400px]:inline">Semi-final · Sillypoint Cup</span>
      </div>

      <div className="absolute bottom-0 left-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs">Tigers · chasing 179</p>
        <div className="relative mt-0.5 h-9 w-28 text-3xl font-black tabular-nums text-white sm:h-11 sm:w-36 sm:text-4xl">
          <span className="absolute inset-0 animate-hud-before motion-reduce:hidden">142/4</span>
          <span className="absolute inset-0 animate-hud-after motion-reduce:animate-none">
            148/4
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 text-right">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs">This over</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          {overChips.map((label) => (
            <span
              key={label}
              className="flex h-6 min-w-6 items-center justify-center rounded-full border border-white/25 px-1.5 text-[10px] font-bold text-gray-200 sm:h-7 sm:min-w-7 sm:text-xs"
            >
              {label}
            </span>
          ))}
          <span className="flex h-6 min-w-6 animate-chip-late items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-extrabold text-gray-900 motion-reduce:animate-none sm:h-7 sm:min-w-7 sm:text-xs">
            6
          </span>
        </div>
      </div>
    </>
  )
}

export default HeroHud
