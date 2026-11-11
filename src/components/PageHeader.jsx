import { eyebrowClass, headingClass } from '../lib/premiumStyles'

const SIZES = {
  lg: 'text-3xl sm:text-4xl',
  md: 'text-2xl sm:text-3xl',
}

function PageHeader({ eyebrow, title, subtitle, action, size = 'lg' }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <span className={eyebrowClass}>{eyebrow}</span>}
        <h1 className={`${eyebrow ? 'mt-3' : ''} ${SIZES[size]} ${headingClass}`}>{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-gray-600 sm:text-base">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default PageHeader
