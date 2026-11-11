// El backend no tiene un endpoint que liste las reservas del usuario,
// así que los IDs se guardan en localStorage, separados por email
function keyFor(email: string) {
  return `bookings:${email}`
}

export function getBookingIds(email: string): number[] {
  try {
    const ids = JSON.parse(localStorage.getItem(keyFor(email)) ?? '[]')
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

export function saveBookingId(email: string, bookingId: number) {
  const ids = getBookingIds(email)
  if (!ids.includes(bookingId)) localStorage.setItem(keyFor(email), JSON.stringify([...ids, bookingId]))
}
