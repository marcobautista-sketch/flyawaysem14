import api from '../api'
import type { Booking, Flight, NewIdResponse } from '../types'

export interface FlightFilters {
  flightNumber: string
  airlineName: string
  from: string
  to: string
}

export async function searchFlights(filters: FlightFilters) {
  const response = await api.get<{ items: Flight[] }>('/flights/search', {
    params: {
      flightNumber: filters.flightNumber.trim() || undefined,
      airlineName: filters.airlineName.trim() || undefined,
      // El backend espera ISO-8601; el valor crudo del input datetime-local da error 500
      estDepartureTimeFrom: filters.from ? new Date(filters.from).toISOString() : undefined,
      estDepartureTimeTo: filters.to ? new Date(filters.to).toISOString() : undefined,
    },
  })
  return response.data.items
}

// Devuelve el ID de la reserva creada
export async function bookFlight(flightId: number) {
  const response = await api.post<NewIdResponse>('/flights/book', { flightId })
  return response.data.id
}

export async function getBooking(bookingId: number) {
  const response = await api.get<Booking>(`/flights/book/${bookingId}`)
  return response.data
}
