import axios from 'axios'

// Los errores 400 llegan como ProblemDetail: el mensaje está en "detail"
export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'No hay conexión con el servidor. Revisa que el backend esté corriendo.'
    return err.response.data?.detail ?? `Error ${err.response.status} del servidor`
  }
  return 'Error inesperado'
}
