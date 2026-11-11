export function formatDateTime(isoDate: string) {
  return new Date(isoDate).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })
}
