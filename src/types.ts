export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface RegisterRequest {
  email: string
  firstName: string
  lastName: string
  password: string
}

export interface Flight {
  id: number
  flightNumber: string
  airlineName: string
  estDepartureTime: string
  estArrivalTime: string
  availableSeats: number
}

export interface Booking {
  id: number
  bookingDate: string
  flightId: number
  flightNumber: string
  airlineName: string
  estDepartureTime: string
  estArrivalTime: string
  customerId: number
  customerFirstName: string
  customerLastName: string
}

export interface NewIdResponse {
  id: number
}
