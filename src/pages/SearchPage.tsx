import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import FlightTable from '../components/FlightTable'
import FormField from '../components/FormField'
import { useAuth } from '../hooks/useAuth'
import { bookFlight, getMyBookings, searchFlights, type FlightFilters } from '../services/flightService'
import type { Flight } from '../types'
import { saveBookingId } from '../utils/bookingStorage'
import { errorMessage } from '../utils/errors'

const emptyFilters: FlightFilters = { flightNumber: '', airlineName: '', from: '', to: '' }

type BookingResult =
  | { ok: true; flightNumber: string; bookingId: number }
  | { ok: false; flightNumber: string; message: string }

export default function SearchPage() {
  const { token, user } = useAuth()
  const [filters, setFilters] = useState(emptyFilters)
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingFlightId, setBookingFlightId] = useState<number | null>(null)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
  const [bookedFlightIds, setBookedFlightIds] = useState<Set<number>>(new Set())

  // El backend deja reservar el mismo vuelo varias veces, así que se marcan los que ya reservaste
  useEffect(() => {
    if (!user) return
    let active = true
    getMyBookings(user).then((mine) => {
      if (active) setBookedFlightIds(new Set(mine.map((booking) => booking.flightId)))
    })
    return () => {
      active = false
    }
  }, [user])

  // Al entrar a la página se listan todos los vuelos
  useEffect(() => {
    let active = true
    searchFlights(emptyFilters)
      .then((items) => {
        if (active) setFlights(items)
      })
      .catch((err) => {
        if (active) setError(errorMessage(err))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function runSearch(current: FlightFilters) {
    if (current.from && current.to && current.from > current.to) {
      setError('La fecha "Salida desde" debe ser anterior a "Salida hasta".')
      return
    }
    setError('')
    setLoading(true)
    try {
      setFlights(await searchFlights(current))
    } catch (err) {
      setError(errorMessage(err))
      setFlights([])
    } finally {
      setLoading(false)
    }
  }

  async function handleBook(flight: Flight) {
    if (bookedFlightIds.has(flight.id)) return
    setBookingFlightId(flight.id)
    setBookingResult(null)
    try {
      const bookingId = await bookFlight(flight.id)
      if (user) saveBookingId(user.email, bookingId)
      setBookingResult({ ok: true, flightNumber: flight.flightNumber, bookingId })
      setBookedFlightIds((current) => new Set(current).add(flight.id))
      // La reserva ocupa un asiento: se actualiza la tabla sin volver a buscar
      setFlights((current) => current.map((f) => (f.id === flight.id ? { ...f, availableSeats: f.availableSeats - 1 } : f)))
    } catch (err) {
      setBookingResult({ ok: false, flightNumber: flight.flightNumber, message: errorMessage(err) })
    } finally {
      setBookingFlightId(null)
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    runSearch(filters)
  }

  function handleClear() {
    setFilters(emptyFilters)
    runSearch(emptyFilters)
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Buscar vuelos</h1>
        <p className="text-sm text-slate-600">Filtra por número de vuelo, aerolínea o fecha de salida. Todos los campos son opcionales.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField id="flightNumber" label="Número de vuelo" placeholder="LA101" value={filters.flightNumber} onChange={handleChange} />
          <FormField id="airlineName" label="Aerolínea" placeholder="LATAM" value={filters.airlineName} onChange={handleChange} />
          <FormField id="from" label="Salida desde" type="datetime-local" value={filters.from} onChange={handleChange} />
          <FormField id="to" label="Salida hasta" type="datetime-local" value={filters.to} onChange={handleChange} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60">
            Buscar
          </button>
          <button type="button" onClick={handleClear} className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100">
            Limpiar filtros
          </button>
        </div>
      </form>

      {error && <Alert type="error">{error}</Alert>}

      {!token && (
        <Alert type="info">
          <Link to="/login" state={{ from: '/search' }} className="font-semibold underline">
            Inicia sesión
          </Link>{' '}
          para reservar un vuelo.
        </Alert>
      )}

      {bookingResult && (
        <div className="sticky top-2 z-10 shadow-sm">
          {bookingResult.ok ? (
            <Alert type="success">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  ¡Reserva confirmada! Vuelo <strong>{bookingResult.flightNumber}</strong>, ID de reserva <strong>#{bookingResult.bookingId}</strong>.
                </span>
                <span className="flex gap-3">
                  <Link to={`/bookings/${bookingResult.bookingId}`} className="font-semibold underline">
                    Ver detalle
                  </Link>
                  <button type="button" onClick={() => setBookingResult(null)} className="font-semibold">
                    Cerrar
                  </button>
                </span>
              </div>
            </Alert>
          ) : (
            <Alert type="error">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  No se pudo reservar el vuelo <strong>{bookingResult.flightNumber}</strong>: {bookingResult.message}
                </span>
                <button type="button" onClick={() => setBookingResult(null)} className="font-semibold">
                  Cerrar
                </button>
              </div>
            </Alert>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Buscando vuelos...</p>
      ) : (
        !error &&
        (flights.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="font-medium text-slate-700">No encontramos vuelos con esos filtros.</p>
            <p className="text-sm text-slate-500">Prueba con otra aerolínea o amplía el rango de fechas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-600">
              {flights.length} {flights.length === 1 ? 'vuelo encontrado' : 'vuelos encontrados'}
            </p>
            <FlightTable
              flights={flights}
              onBook={token ? handleBook : undefined}
              bookingFlightId={bookingFlightId}
              bookedFlightIds={bookedFlightIds}
            />
          </div>
        ))
      )}
    </section>
  )
}
