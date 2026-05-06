import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'

const menu = [
  { label: 'Dashboard',    path: '/dashboard',    icon: '📊' },
  { label: 'Clientes',     path: '/clientes',     icon: '👤' },
  { label: 'Serviços',     path: '/servicos',     icon: '✨' },
  { label: 'Agendamentos', path: '/agendamentos', icon: '📅' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-lg font-bold text-orange-500">AutoEstética</h1>
        <p className="text-xs text-gray-500 mt-0.5">Painel Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition
              ${location.pathname === item.path
                ? 'bg-orange-500 text-white font-semibold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full text-sm text-gray-400 hover:text-red-400 py-2 transition"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}