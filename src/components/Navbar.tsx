import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function linkClass({ isActive }: { isActive: boolean }) {
  const base = 'rounded-md px-3 py-2 text-sm font-medium'
  return isActive ? `${base} bg-blue-800 text-white` : `${base} text-blue-100 hover:bg-blue-800/60 hover:text-white`
}

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-blue-900">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
        <Link to="/search" className="mr-4 text-lg font-bold tracking-tight text-white">
          Fly Away <span className="text-amber-400">Travel</span>
        </Link>
        <NavLink to="/search" className={linkClass}>
          Buscar vuelos
        </NavLink>
        {token && (
          <NavLink to="/bookings" end className={linkClass}>
            Mis reservas
          </NavLink>
        )}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {token ? (
            <>
              {user && (
                <span className="text-sm text-blue-100">
                  Hola, <strong className="text-white">{user.firstName} {user.lastName}</strong>
                </span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-blue-300/50 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Iniciar sesión
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
