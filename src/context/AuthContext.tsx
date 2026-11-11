import { createContext, useEffect, useState, type ReactNode } from 'react'
import * as authService from '../services/authService'
import type { User } from '../types'

interface AuthContextValue {
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)

  // Cada vez que hay un token nuevo se piden los datos del usuario
  useEffect(() => {
    if (!token) return
    let active = true
    authService
      .getCurrentUser()
      .then((me) => {
        if (active) setUser(me)
      })
      .catch(() => {
        // si el token no sirve, el interceptor de api.ts cierra la sesión
      })
    return () => {
      active = false
    }
  }, [token])

  async function login(email: string, password: string) {
    const newToken = await authService.login(email, password)
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
}
