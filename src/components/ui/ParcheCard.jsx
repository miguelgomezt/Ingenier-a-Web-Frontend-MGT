import { useNavigate } from 'react-router-dom'
import { FiUsers, FiHash } from 'react-icons/fi'

function ParcheCard({ parche }) {
  const navigate = useNavigate()

  return (
    <article
      onClick={() => navigate(`/parches/${parche.id}`)}
      className="bg-dark-800 border border-dark-600 rounded-2xl p-5 cursor-pointer hover:border-brand-500/50 hover:bg-dark-700 transition-all duration-200 animate-slide-up group"
      aria-label={`Parche: ${parche.name}`}
    >
      <header className="mb-3">
        <h3 className="font-display font-bold text-white group-hover:text-brand-400 transition-colors leading-tight">
          {parche.name}
        </h3>
      </header>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{parche.description}</p>

      <footer className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <FiHash size={12} className="text-brand-400" />
          <span className="font-mono">{parche.inviteCode}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiUsers size={12} className="text-brand-400" />
          <span>Ver miembros</span>
        </div>
      </footer>
    </article>
  )
}

export default ParcheCard