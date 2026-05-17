import { useNavigate } from 'react-router-dom'
import { FiUsers, FiHash } from 'react-icons/fi'

function ParcheCard({ parche }) {
  const navigate = useNavigate()

  return (
    <article
      className="bg-dark-800 border border-dark-600 rounded-xl p-5 hover:border-brand-500 transition-colors"
      aria-label={`Parche: ${parche.name}`}
    >
      <header className="mb-3 cursor-pointer" onClick={() => navigate(`/parches/${parche.id}`)}>
        <h3 className="font-bold text-white hover:text-brand-400 transition-colors">{parche.name}</h3>
      </header>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2 cursor-pointer" onClick={() => navigate(`/parches/${parche.id}`)}>
        {parche.description}
      </p>

      <footer className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate(`/parches/${parche.id}`)}>
          <FiHash size={12} className="text-brand-400" />
          <span className="font-mono">{parche.inviteCode}</span>
        </div>
        <button
          onClick={() => navigate(`/parches/${parche.id}?tab=miembros`)}
          className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors"
        >
          <FiUsers size={12} />
          <span>Ver miembros</span>
        </button>
      </footer>
    </article>
  )
}

export default ParcheCard