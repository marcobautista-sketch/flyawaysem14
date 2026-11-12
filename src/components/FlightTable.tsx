import type { Flight } from '../types'
import { formatDateTime } from '../utils/format'

interface FlightTableProps {
  flights: Flight[]
  // Solo se pasa cuando hay sesión: sin esto no aparece el botón "Reservar"
  onBook?: (flight: Flight) => void
  bookingFlightId?: number | null
  bookedFlightIds?: Set<number>
}

export default function FlightTable({ flights, onBook, bookingFlightId, bookedFlightIds }: FlightTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3">Vuelo</th>
            <th className="px-4 py-3">Aerolínea</th>
            <th className="px-4 py-3">Salida</th>
            <th className="px-4 py-3">Llegada</th>
            <th className="px-4 py-3 text-right">Asientos</th>
            {onBook && <th className="px-4 py-3 text-right">Acción</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {flights.map((flight) => (
            <tr key={flight.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-mono font-semibold text-blue-900">{flight.flightNumber}</td>
              <td className="px-4 py-3">{flight.airlineName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(flight.estDepartureTime)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(flight.estArrivalTime)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{flight.availableSeats}</td>
              {onBook && (
                <td className="px-4 py-3 text-right">
                  {bookedFlightIds?.has(flight.id) ? (
                    <span className="inline-block rounded-md bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-800">Reservado</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onBook(flight)}
                      disabled={bookingFlightId != null}
                      className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-blue-950 hover:bg-amber-400 disabled:opacity-50"
                    >
                      {bookingFlightId === flight.id ? 'Reservando...' : 'Reservar'}
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
