import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-5xl font-bold text-blue-900">404</p>
      <p className="text-slate-600">Esta página no existe.</p>
      <Link to="/search" className="font-medium text-blue-700 hover:underline">
        Ir a buscar vuelos
      </Link>
    </section>
  )
}
