import { ArrowRight, Loader2, Trophy, Users } from 'lucide-react'
import { useDemoLogin } from '../hooks/useDemoLogin'
import { cardClass, cardHoverClass, headingClass, iconTileClass } from '../lib/premiumStyles'

const DEMO_ACCOUNTS = [
  {
    role: 'organizer',
    title: 'Tournament organizer',
    description: 'Create tournaments, schedule matches and share the scorer link.',
    Icon: Trophy,
  },
  {
    role: 'manager',
    title: 'Team manager',
    description: 'Create teams, register them for tournaments and follow results.',
    Icon: Users,
  },
]

function DemoLoginPanel() {
  const { login, pendingRole } = useDemoLogin()

  return (
    <section aria-labelledby="demo-accounts-heading">
      <h2 id="demo-accounts-heading" className={`text-lg ${headingClass}`}>
        Try a demo account
      </h2>
      <p className="mt-1 text-sm text-gray-600">Explore Sillypoint in one click. No mobile number or OTP needed.</p>

      <div className="mt-4 space-y-3">
        {DEMO_ACCOUNTS.map(({ role, title, description, Icon }) => {
          const pending = pendingRole === role

          return (
            <button
              key={role}
              type="button"
              onClick={() => login(role)}
              disabled={Boolean(pendingRole)}
              className={`group flex w-full items-center gap-3 p-3 text-left ${cardClass} ${cardHoverClass} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:border-gray-200 disabled:hover:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
            >
              <span className={iconTileClass}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-gray-900">{title}</span>
                <span className="block text-xs text-gray-600">{description}</span>
              </span>
              {pending ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-red-600 motion-reduce:animate-none" aria-label="Logging in" />
              ) : (
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-red-600" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default DemoLoginPanel
