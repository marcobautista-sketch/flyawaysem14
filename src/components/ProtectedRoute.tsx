import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Envuelve las rutas que necesitan sesión: sin token, manda al login
export default function ProtectedRoute() {
  const { token } = useAuth()
  const location = useLocation()

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
