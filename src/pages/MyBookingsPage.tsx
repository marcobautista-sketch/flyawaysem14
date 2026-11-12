import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getMyBookings } from '../services/flightService'
import type { Booking } from '../types'
import { formatDateTime } from '../utils/format'

export default function MyBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let active = true
    getMyBookings(user).then((found) => {
      if (!active) return
      setBookings(found.sort((a, b) => a.estDepartureTime.localeCompare(b.estDepartureTime)))
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [user])

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Mis reservas</h1>
        <p className="text-sm text-slate-600">Los vuelos que reservaste desde esta computadora.</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando reservas...</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <p className="font-medium text-slate-700">Aún no tienes reservas.</p>
          <Link to="/search" className="text-sm font-medium text-blue-700 hover:underline">
            Buscar un vuelo
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Reserva</th>
                <th className="px-4 py-3">Vuelo</th>
                <th className="px-4 py-3">Aerolínea</th>
                <th className="px-4 py-3">Salida</th>
                <th className="px-4 py-3 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 tabular-nums text-slate-500">#{booking.id}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-blue-900">{booking.flightNumber}</td>
                  <td className="px-4 py-3">{booking.airlineName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(booking.estDepartureTime)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/bookings/${booking.id}`} className="font-medium text-blue-700 hover:underline">
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
