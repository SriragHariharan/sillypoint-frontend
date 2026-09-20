import logo from '../assets/app_logo.png'

function Footer() {
  return (
    <footer className="bg-white py-8 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center text-sm text-gray-500 sm:px-6 md:flex-row md:text-left">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Sillypoint" className="h-6 w-6 rounded" />
          <span className="font-semibold text-gray-800">Sillypoint</span>
        </div>
        <p>Tournament management for the cricket you actually play.</p>
        <p>&copy; {new Date().getFullYear()} Sillypoint. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
