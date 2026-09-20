const roles = [
  { title: 'Organizers', description: 'Manage teams, fixtures, scorers and announcements from one dashboard.' },
  { title: 'Team Managers', description: 'Register squads, submit playing XIs and track results.' },
  { title: 'Scorers', description: 'Run the match with a fast, purpose-built scoring interface.' },
  { title: 'Spectators', description: 'Follow any tournament, live, with no account required.' },
]

function Roles() {
  return (
    <section className="border-y border-gray-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <h2 className="text-center text-sm font-bold uppercase tracking-wide text-gray-400">
          Built for everyone at the ground
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <div key={role.title} className="text-center">
              <h3 className="font-bold text-gray-900">{role.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Roles
