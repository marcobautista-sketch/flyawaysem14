import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import FormField from '../components/FormField'
import { register } from '../services/authService'
import type { RegisterRequest } from '../types'
import { errorMessage } from '../utils/errors'

type FieldErrors = Partial<Record<keyof RegisterRequest, string>>

const emptyForm: RegisterRequest = { email: '', firstName: '', lastName: '', password: '' }

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Después del registro se muestra el mensaje de éxito y luego se pasa al login
  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => navigate('/login', { state: { email: form.email.trim() } }), 2000)
    return () => clearTimeout(timer)
  }, [success, navigate, form.email])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const errors: FieldErrors = {}
    for (const field of Object.keys(form) as (keyof RegisterRequest)[]) {
      if (!form[field].trim()) errors[field] = 'Este campo es obligatorio'
    }
    return errors
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    try {
      await register({
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
      })
      setSuccess(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Crear cuenta</h1>
        <p className="text-sm text-slate-600">Regístrate para reservar vuelos con Fly Away.</p>
      </div>

      {success && <Alert type="success">Cuenta creada con éxito. Te llevamos al inicio de sesión...</Alert>}
      {error && (
        <Alert type="error">
          <p className="font-medium">No se pudo crear la cuenta:</p>
          <ul className="list-inside list-disc">
            {error.split('; ').map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={handleChange} error={fieldErrors.email} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="firstName" label="Nombre" autoComplete="given-name" value={form.firstName} onChange={handleChange} error={fieldErrors.firstName} />
          <FormField id="lastName" label="Apellido" autoComplete="family-name" value={form.lastName} onChange={handleChange} error={fieldErrors.lastName} />
        </div>
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          hint="Mínimo 8 caracteres, con al menos una mayúscula y un número."
        />
        <button
          type="submit"
          disabled={loading || success}
          className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-blue-700 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </section>
  )
}
