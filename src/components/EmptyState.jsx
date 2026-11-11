import { cardClass, iconTileClass } from '../lib/premiumStyles'

function EmptyState({ icon: Icon, title, children, action, as: Title = 'p' }) {
  return (
    <div className={`${cardClass} px-6 py-10 text-center`}>
      {Icon && (
        <span className={`${iconTileClass} mx-auto`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <Title className={`${Icon ? 'mt-4' : ''} text-base font-bold text-gray-900`}>{title}</Title>
      {children && <p className="mt-1 text-sm text-gray-600">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export default EmptyState
