import { FiCheckCircle } from 'react-icons/fi'
import Button from './Button'

const PLAN_STATES = {
  0: { label: 'Borrador', color: 'text-gray-400', next: 'VotingOpen' },
  1: { label: 'Votación Abierta', color: 'text-green-400', next: 'VotingClosed' },
  2: { label: 'Votación Cerrada', color: 'text-yellow-400', next: 'Scheduled' },
  3: { label: 'Programado', color: 'text-brand-400', next: null },
}

const ATTENDANCE_OPTIONS = [
  { value: 'Yes', label: 'Voy' },
  { value: 'No', label: 'No voy' },
  { value: 'Maybe', label: 'Tal vez' },
]

function PlanVotingSection({ planes, votosRealizados, attendanceSelections, onVotar, onAttendance, onChangePlanState, onCrearPlan }) {
  if (planes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <p className="text-gray-300 font-semibold">Sin planes</p>
        <p className="text-sm text-gray-500">Aún no hay planes en este parche.</p>
        <Button onClick={onCrearPlan}>Crear el primero</Button>
      </div>
    )
  }

  return (
    <section aria-label="Planes del parche">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl text-white">Planes</h2>
        <Button onClick={onCrearPlan}>Crear plan</Button>
      </div>

      <ul className="flex flex-col gap-4" role="list">
        {planes.map(plan => {
          const stateInfo = PLAN_STATES[plan.state] || PLAN_STATES[0]
          const totalVotos = plan.options?.reduce((acc, op) => acc + (op.voteCount || 0), 0) || 0
          const yaVoto = votosRealizados[plan.id]
          const asistencia = attendanceSelections[plan.id]

          return (
            <li key={plan.id} className="bg-dark-800 border border-dark-600 rounded-2xl p-5">

              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-display font-bold text-white">{plan.title}</h3>
                <span className={`text-xs font-semibold shrink-0 ${stateInfo.color}`}>
                  {stateInfo.label}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">{plan.description}</p>

              {plan.state === 1 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                    Vota por una opción
                  </p>
                  <ul className="flex flex-col gap-2" role="list">
                    {plan.options?.map(opcion => {
                      const pct = totalVotos > 0 ? Math.round((opcion.voteCount / totalVotos) * 100) : 0
                      return (
                        <li key={opcion.id}>
                          <button
                            onClick={() => onVotar(plan.id, opcion.id)}
                            aria-pressed={yaVoto === opcion.id}
                            className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                              yaVoto === opcion.id
                                ? 'border-brand-500 bg-brand-500/20'
                                : 'border-dark-600 hover:border-dark-500 bg-dark-700'
                            }`}
                          >
                            <div className="flex justify-between text-sm mb-1.5">
                              <div>
                                <span className="font-semibold text-white">{opcion.lugar}</span>
                                <span className="text-gray-400 text-xs ml-2">
                                  {new Date(opcion.time).toLocaleDateString('es-CO', {
                                    day: 'numeric', month: 'short',
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <span className="text-gray-400">{pct}%</span>
                            </div>
                            <div className="w-full bg-dark-600 rounded-full h-1.5">
                              <div
                                className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">{totalVotos} votos totales</p>
                </div>
              )}

              {(plan.state === 2 || plan.state === 3) && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                    Resultados
                  </p>
                  <ul className="flex flex-col gap-2" role="list">
                    {plan.options?.map(opcion => {
                      const pct = totalVotos > 0 ? Math.round((opcion.voteCount / totalVotos) * 100) : 0
                      const esGanadora = opcion.voteCount === Math.max(...plan.options.map(o => o.voteCount || 0))
                      return (
                        <li
                          key={opcion.id}
                          className={`rounded-xl border px-4 py-3 ${
                            esGanadora ? 'border-brand-500 bg-brand-500/10' : 'border-dark-600 bg-dark-700'
                          }`}
                        >
                          <div className="flex justify-between text-sm mb-1.5">
                            <div className="flex items-center gap-2">
                              {esGanadora && <FiCheckCircle size={14} className="text-brand-400" />}
                              <span className="font-semibold text-white">{opcion.lugar}</span>
                              <span className="text-gray-400 text-xs">
                                {new Date(opcion.time).toLocaleDateString('es-CO', {
                                  day: 'numeric', month: 'short',
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <span className="text-gray-400">{pct}%</span>
                          </div>
                          <div className="w-full bg-dark-600 rounded-full h-1.5">
                            <div
                              className="bg-brand-500 h-1.5 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {plan.state === 3 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                    ¿Vas a este plan?
                  </p>
                  <div className="flex gap-2">
                    {ATTENDANCE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => onAttendance(plan.id, opt.value)}
                        aria-pressed={asistencia === opt.value}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          asistencia === opt.value
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-dark-700 border-dark-600 text-gray-400 hover:border-dark-500'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {stateInfo.next && (
                <Button
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={() => onChangePlanState(plan.id, stateInfo.next)}
                >
                  Mover a: {stateInfo.next}
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default PlanVotingSection