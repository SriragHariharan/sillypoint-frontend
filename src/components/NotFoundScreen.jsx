import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { primaryButtonClass } from '../lib/premiumStyles'
import EmptyState from './EmptyState'

function NotFoundScreen({ title, message, to, label }) {
  return (
    <main className="mx-auto max-w-md px-5 py-20">
      <EmptyState
        as="h1"
        icon={SearchX}
        title={title}
        action={
          <Link to={to} className={`inline-block px-6 ${primaryButtonClass}`}>
            {label}
          </Link>
        }
      >
        {message}
      </EmptyState>
    </main>
  )
}

export default NotFoundScreen
