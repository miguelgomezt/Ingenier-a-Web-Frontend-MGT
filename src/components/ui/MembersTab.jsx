import { FiUsers } from 'react-icons/fi'
import { EmptyState } from './Feedback'

const getRoleLabel = (role) => {
  if (role === 0) return 'Owner'
  if (role === 1) return 'Moderador'
  return 'Miembro'
}

const getRoleColor = (role) => {
  if (role === 0) return 'text-brand-400 bg-brand-500/10'
  if (role === 1) return 'text-blue-400 bg-blue-500/10'
  return 'text-gray-400 bg-dark-600'
}

function MembersTab({ members }) {
  return (
    <section aria-label="Miembros del parche">
      <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
        <FiUsers size={18} className="text-brand-400" />
        Miembros ({members.length})
      </h2>
      {members.length === 0 && (
        <EmptyState title="Sin miembros" description="Aún no hay miembros en este parche." />
      )}
      <ul className="flex flex-col gap-2" role="list">
        {members.map(member => {
          const nombre = member.user?.nombreCompleto || member.userName || member.usuarioId || '?'
          return (
            <li
              key={member.id}
              className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-dark-600 flex items-center justify-center text-sm font-bold text-white">
                  {nombre.charAt(0)}
                </div>
                <span className="text-sm text-white font-semibold">{nombre}</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getRoleColor(member.role)}`}>
                {getRoleLabel(member.role)}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default MembersTab