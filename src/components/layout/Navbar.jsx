import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiPlusCircle, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/parches', label: 'Parches', icon: FiHome },
  { to: '/parches/nuevo', label: 'Crear', icon: FiPlusCircle },
]

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/parches" className="font-bold text-xl text-white">
          Parche<span className="text-orange-500">Plan</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <FiUser size={14} className="text-orange-400" />
              {user.nombreCompleto || user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-700"
          >
            <FiLogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 flex justify-around py-2 z-50">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-4 py-1 text-xs ${
                isActive ? 'text-orange-400' : 'text-gray-500'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}

export default Navbar