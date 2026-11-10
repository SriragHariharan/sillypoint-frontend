function SectionHeading({ eyebrow, title, children, center = false }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-red-200">
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-gray-300 sm:text-lg">{children}</p>}
    </div>
  )
}

export default SectionHeading
