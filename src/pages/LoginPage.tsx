import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import FormField from '../components/FormField'
import { useAuth } from '../hooks/useAuth'
import { errorMessage } from '../utils/errors'

interface LoginLocationState {
  email?: string
  from?: string
}

export default function LoginPage() {
  const { token, login } = useAuth()
  const navigate = useNavigate()
  const state = useLocation().state as LoginLocationState | null
  const destination = state?.from ?? '/search'

  const [email, setEmail] = useState(state?.email ?? '')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Si ya hay sesión, no tiene sentido mostrar el formulario
  if (token && !loading) return <Navigate to={destination} replace />

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const errors = {
      email: email.trim() ? undefined : 'Ingresa tu email',
      password: password ? undefined : 'Ingresa tu contraseña',
    }
    setFieldErrors(errors)
    if (errors.email || errors.password) return

    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Iniciar sesión</h1>
        <p className="text-sm text-slate-600">Ingresa para reservar y ver tus vuelos.</p>
      </div>

      {state?.email && !error && <Alert type="success">Tu cuenta está lista. Ahora inicia sesión.</Alert>}
      {state?.from && !state.email && !error && <Alert type="info">Inicia sesión para continuar.</Alert>}
      {error && <Alert type="error">No se pudo iniciar sesión: {error}</Alert>}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldErrors.email} />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <button type="submit" disabled={loading} className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-medium text-blue-700 hover:underline">
          Regístrate
        </Link>
      </p>
    </section>
  )
}
