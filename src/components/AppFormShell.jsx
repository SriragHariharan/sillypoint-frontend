import AppNavbar from './AppNavbar'
import PageHeader from './PageHeader'

function AppFormShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-white pb-16 sm:bg-gray-50 sm:pb-0">
      <AppNavbar />
      <main className="mx-auto w-full max-w-md px-5 py-6 sm:max-w-lg sm:py-10">
        <div className="sm:overflow-hidden sm:rounded-3xl sm:border sm:border-gray-200 sm:bg-white/90 sm:shadow-xl sm:shadow-red-600/10 sm:backdrop-blur">
          <div className="hidden h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700 sm:block" />
          <div className="sm:p-8">
            <PageHeader size="md" eyebrow={eyebrow} title={title} subtitle={subtitle} />
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AppFormShell
