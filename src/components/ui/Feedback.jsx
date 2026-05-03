import { FiAlertCircle, FiInbox, FiRefreshCw } from 'react-icons/fi'

export function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="status">
      <div className="w-8 h-8 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
    </div>
  )
}

export function EmptyState({ title = 'Sin resultados', description = 'No hay nada por aquí.', action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <FiInbox size={40} className="text-gray-600" />
      <div>
        <p className="font-semibold text-gray-300">{title}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {action && action}
    </div>
  )
}

export function ErrorState({ message = 'Ocurrió un error.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <FiAlertCircle size={40} className="text-red-500" />
      <div>
        <p className="font-semibold text-gray-300">Algo salió mal</p>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300">
          <FiRefreshCw size={14} /> Reintentar
        </button>
      )}
    </div>
  )
}