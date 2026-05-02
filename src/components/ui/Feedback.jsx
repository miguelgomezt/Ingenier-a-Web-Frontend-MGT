import { FiAlertCircle, FiInbox, FiRefreshCw } from 'react-icons/fi'

export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Cargando">
      <div className={`${sizes[size]} border-2 border-dark-600 border-t-brand-500 rounded-full animate-spin`} />
    </div>
  )
}

export function EmptyState({ title = 'Sin resultados', description = 'No hay nada por aquí todavía.', action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center animate-fade-in">
      <FiInbox size={40} className="text-gray-600" />
      <div>
        <p className="font-display font-semibold text-gray-300">{title}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {action && action}
    </div>
  )
}

export function ErrorState({ message = 'Ocurrió un error.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center animate-fade-in">
      <FiAlertCircle size={40} className="text-red-500" />
      <div>
        <p className="font-display font-semibold text-gray-300">Algo salió mal</p>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          <FiRefreshCw size={14} /> Reintentar
        </button>
      )}
    </div>
  )
}