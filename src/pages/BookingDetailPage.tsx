import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from '../components/Alert'
import { getBooking } from '../services/flightService'
import type { Booking } from '../types'
import { errorMessage } from '../utils/errors'
import { formatDateTime } from '../utils/format'

export default function BookingDetailPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getBooking(Number(id))
      .then((data) => {
        if (active) setBooking(data)
      })
      .catch((err) => {
        if (!active) return
        // Si la reserva no existe, el backend responde 500 sin mensaje
        const notFound = axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 500)
        setError(notFound ? `No encontramos la reserva #${id}.` : errorMessage(err))
      })
    return () => {
      active = false
    }
  }, [id])

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap gap-4 text-sm">
        <Link to="/bookings" className="font-medium text-blue-700 hover:underline">
          ← Mis reservas
        </Link>
        <Link to="/search" className="font-medium text-blue-700 hover:underline">
          Buscar más vuelos
        </Link>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {!booking && !error && <p className="text-sm text-slate-500">Cargando reserva...</p>}

      {booking && (
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="flex flex-wrap items-end justify-between gap-2 bg-blue-900 px-6 py-5 text-white">
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-200">Reserva #{booking.id}</p>
              <h1 className="font-mono text-3xl font-bold">{booking.flightNumber}</h1>
              <p className="text-blue-100">{booking.airlineName}</p>
            </div>
            <p className="text-sm text-blue-200">Reservado el {formatDateTime(booking.bookingDate)}</p>
          </header>

          <dl className="grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Salida</dt>
              <dd className="font-medium">{formatDateTime(booking.estDepartureTime)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Llegada</dt>
              <dd className="font-medium">{formatDateTime(booking.estArrivalTime)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Pasajero</dt>
              <dd className="font-medium">
                {booking.customerFirstName} {booking.customerLastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">ID del vuelo</dt>
              <dd className="font-medium">{booking.flightId}</dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  )
}
