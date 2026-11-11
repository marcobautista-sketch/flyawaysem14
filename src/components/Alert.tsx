import type { ReactNode } from 'react'

interface AlertProps {
  type: 'success' | 'error' | 'info'
  children: ReactNode
}

const styles = {
  success: 'border-green-300 bg-green-50 text-green-800',
  error: 'border-red-300 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-900',
}

export default function Alert({ type, children }: AlertProps) {
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={`rounded-md border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  )
}
