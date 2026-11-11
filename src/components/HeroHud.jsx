const overChips = ['1', '4', 'Wd', '0']

function HeroHud() {
  return (
    <>
      <div className="absolute bottom-0 left-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 sm:text-xs">Tigers · chasing 179</p>
        <div className="relative mt-0.5 h-9 w-28 text-3xl font-black tabular-nums text-gray-900 sm:h-11 sm:w-36 sm:text-4xl">
          <span className="absolute inset-0 animate-hud-before motion-reduce:hidden">142/4</span>
          <span className="absolute inset-0 animate-hud-after motion-reduce:animate-none">
            148/4
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 text-right">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 sm:text-xs">This over</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          {overChips.map((label) => (
            <span
              key={label}
              className="flex h-6 min-w-6 items-center justify-center rounded-full border border-gray-300 px-1.5 text-[10px] font-bold text-gray-700 sm:h-7 sm:min-w-7 sm:text-xs"
            >
              {label}
            </span>
          ))}
          <span className="flex h-6 min-w-6 animate-chip-late items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-extrabold text-white motion-reduce:animate-none sm:h-7 sm:min-w-7 sm:text-xs">
            6
          </span>
        </div>
      </div>
    </>
  )
}

export default HeroHud
