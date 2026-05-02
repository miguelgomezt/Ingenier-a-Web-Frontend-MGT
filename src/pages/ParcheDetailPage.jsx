import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiUsers, FiHash, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { getParcheByIdService, getParcheMembersService } from '../api/parcheService'
import { getPlanesByParcheService, changePlanStateService } from '../api/planService'
import { createVoteService, updateVoteService } from '../api/voteService'
import { confirmAttendanceService } from '../api/attendanceService'
import { getRankingByParcheService } from '../api/rankingService'
import mockParches from '../Data/parches'
import mockPlanes from '../Data/planes'
import mockMembers from '../Data/members'
import mockRanking from '../Data/ranking'
import Button from '../components/ui/Button'
import { Spinner, ErrorState, EmptyState } from '../components/ui/Feedback'

const PLAN_STATES = {
  0: { label: 'Borrador', color: 'text-gray-400', next: 'VotingOpen' },
  1: { label: 'Votación Abierta', color: 'text-green-400', next: 'VotingClosed' },
  2: { label: 'Votación Cerrada', color: 'text-yellow-400', next: 'Scheduled' },
  3: { label: 'Programado', color: 'text-brand-400', next: null },
}

const ATTENDANCE_OPTIONS = [
  { value: 'Yes', label: ' Voy' },
  { value: 'No', label: ' No voy' },
  { value: 'Maybe', label: ' Tal vez' },
]

function ParcheDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()

  const [parche, setParche] = useState(null)
  const [members, setMembers] = useState([])
  const [planes, setPlanes] = useState([])
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('planes')
  const [votosRealizados, setVotosRealizados] = useState({})
  const [attendanceSelections, setAttendanceSelections] = useState({})

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const [parcheData, membersData, planesData, rankingData] = await Promise.all([
        getParcheByIdService(id, token),
        getParcheMembersService(id, token),
        getPlanesByParcheService(id, token),
        getRankingByParcheService(id, token),
      ])
      setParche(parcheData)
      setMembers(membersData)
      setPlanes(planesData)
      setRanking(rankingData)
    } catch {
      const mockP = mockParches.find(p => p.id === parseInt(id))
      const mockM = mockMembers.filter(m => m.parcheId === parseInt(id))
      const mockPl = mockPlanes.filter(p => p.parcheId === parseInt(id))
      const mockR = mockRanking.filter(r => r.parcheId === parseInt(id))
      if (mockP) {
        setParche(mockP)
        setMembers(mockM)
        setPlanes(mockPl)
        setRanking(mockR)
      } else {
        setError('Parche no encontrado')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [id])

  const handleVotar = async (planId, planOptionId) => {
    try {
      if (votosRealizados[planId]) {
        await updateVoteService({ planOptionId }, token)
      } else {
        await createVoteService({ planOptionId }, token)
      }
    } catch {
      // continuar con estado local
    }
    setVotosRealizados(prev => ({ ...prev, [planId]: planOptionId }))
  }

  const handleAttendance = async (planId, status) => {
    try {
      await confirmAttendanceService({ PlanId: planId, status }, token)
    } catch {
      // continuar con estado local
    }
    setAttendanceSelections(prev => ({ ...prev, [planId]: status }))
  }

  const handleChangePlanState = async (planId, nextState) => {
    try {
      await changePlanStateService(planId, nextState, token)
      await fetchAll()
    } catch {
      console.error('Error al cambiar estado')
    }
  }

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

  if (loading) return <Spinner className="py-32" />
  if (error) return <ErrorState message={error} onRetry={() => navigate('/parches')} />

  const tabs = [
    { id: 'planes', label: 'Planes' },
    { id: 'miembros', label: 'Miembros' },
    { id: 'ranking', label: 'Ranking' },
  ]

  return (
    <article aria-label={`Detalle del parche: ${parche?.name}`} className="max-w-2xl mx-auto">

      <button
        onClick={() => navigate('/parches')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <FiArrowLeft size={16} /> Volver a parches
      </button>

      <header className="bg-dark-800 border border-dark-600 rounded-2xl p-6 mb-6 animate-slide-up">
        <h1 className="font-display font-extrabold text-2xl text-white mb-2">{parche?.name}</h1>
        <p className="text-gray-400 mb-4">{parche?.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiHash size={14} className="text-brand-400" />
          <span>Código: <span className="font-mono text-white">{parche?.inviteCode}</span></span>
        </div>
      </header>

      <nav className="flex gap-2 mb-6" aria-label="Secciones del parche">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-brand-500 text-white'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'planes' && (
        <section aria-label="Planes del parche">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-white">Planes</h2>
            <Button onClick={() => navigate(`/parches/${id}/planes/nuevo`)}>
              Crear plan
            </Button>
          </div>

          {planes.length === 0 && (
            <EmptyState
              title="Sin planes"
              description="Aún no hay planes en este parche."
              action={<Button onClick={() => navigate(`/parches/${id}/planes/nuevo`)}>Crear el primero</Button>}
            />
          )}

          <ul className="flex flex-col gap-4" role="list">
            {planes.map(plan => {
              const stateInfo = PLAN_STATES[plan.state] || PLAN_STATES[0]
              const totalVotos = plan.options?.reduce((acc, op) => acc + (op.voteCount || 0), 0) || 0
              const yaVoto = votosRealizados[plan.id]
              const asistencia = attendanceSelections[plan.id]

              return (
                <li key={plan.id} className="bg-dark-800 border border-dark-600 rounded-2xl p-5 animate-slide-up">

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
                                onClick={() => handleVotar(plan.id, opcion.id)}
                                aria-pressed={yaVoto === opcion.id}
                                className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                                  yaVoto === opcion.id
                                    ? 'border-brand-500 bg-brand-500/20'
                                    : 'border-dark-600 hover:border-dark-500 bg-dark-700'
                                }`}
                              >
                                <div className="flex justify-between text-sm mb-1.5">
                                  <div>
                                    <span className="font-semibold text-white">{opcion.place}</span>
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
                          const esGanadora = opcion.voteCount === Math.max(...plan.options.map(o => o.voteCount))
                          return (
                            <li
                              key={opcion.id}
                              className={`rounded-xl border px-4 py-3 ${
                                esGanadora
                                  ? 'border-brand-500 bg-brand-500/10'
                                  : 'border-dark-600 bg-dark-700'
                              }`}
                            >
                              <div className="flex justify-between text-sm mb-1.5">
                                <div className="flex items-center gap-2">
                                  {esGanadora && <FiCheckCircle size={14} className="text-brand-400" />}
                                  <span className="font-semibold text-white">{opcion.place}</span>
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
                            onClick={() => handleAttendance(plan.id, opt.value)}
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
                      onClick={() => handleChangePlanState(plan.id, stateInfo.next)}
                    >
                      Mover a: {stateInfo.next}
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {activeTab === 'miembros' && (
        <section aria-label="Miembros del parche">
          <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
            <FiUsers size={18} className="text-brand-400" />
            Miembros ({members.length})
          </h2>
          {members.length === 0 && (
            <EmptyState title="Sin miembros" description="Aún no hay miembros en este parche." />
          )}
          <ul className="flex flex-col gap-2" role="list">
            {members.map(member => (
              <li
                key={member.id}
                className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-dark-600 flex items-center justify-center text-sm font-bold text-white">
                    {member.userName?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm text-white font-semibold">{member.userName}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getRoleColor(member.role)}`}>
                  {getRoleLabel(member.role)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeTab === 'ranking' && (
        <section aria-label="Ranking del parche">
          <h2 className="font-display font-bold text-xl text-white mb-4">Ranking del parche</h2>
          {ranking.length === 0 && (
            <EmptyState title="Sin ranking" description="Aún no hay actividad en este parche." />
          )}
          <ul className="flex flex-col gap-2" role="list">
            {ranking.map((entry, index) => (
              <li
                key={entry.id}
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
      )}

    </article>
  )
}

export default ParcheDetailPage