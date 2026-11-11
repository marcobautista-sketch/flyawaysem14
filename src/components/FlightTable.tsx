import type { Flight } from '../types'
import { formatDateTime } from '../utils/format'

interface FlightTableProps {
  flights: Flight[]
}

export default function FlightTable({ flights }: FlightTableProps) {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
