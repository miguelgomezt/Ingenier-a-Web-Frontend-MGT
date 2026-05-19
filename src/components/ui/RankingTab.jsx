import { EmptyState } from './Feedback'

function RankingTab({ ranking }) {
  return (
    <section aria-label="Ranking del parche">
      <h2 className="font-display font-bold text-xl text-white mb-4">Ranking del parche</h2>
      {ranking.length === 0 && (
        <EmptyState title="Sin ranking" description="Aún no hay actividad en este parche." />
      )}
      <ul className="flex flex-col gap-2" role="list">
        {ranking.map((entry, index) => (
          <li
            key={entry.id || index}
            className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 flex items-center gap-4"
          >
            <span className={`font-display font-bold text-lg w-8 text-center ${
              index === 0 ? 'text-yellow-400' :
              index === 1 ? 'text-gray-300' :
              index === 2 ? 'text-amber-600' : 'text-gray-500'
            }`}>
              #{index + 1}
            </span>
            <div className="w-9 h-9 rounded-full bg-dark-600 flex items-center justify-center text-sm font-bold text-white">
              {entry.userName?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{entry.userName}</p>
              <p className="text-xs text-gray-500">
                Organizador: {entry.organizerScore} pts · Fantasma: {entry.ghostScore} pts
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RankingTab