import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { FiArrowLeft, FiHash } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { getParcheByIdService, getParcheMembersService } from '../api/parcheService'
import { getPlanesByParcheService, changePlanStateService } from '../api/planService'
import { createVoteService, updateVoteService } from '../api/voteService'
import { confirmAttendanceService, getAttendanceByPlanService } from '../api/attendanceService'
import { getRankingByParcheService } from '../api/rankingService'
import mockParches from '../data/parches'
import mockPlanes from '../data/planes'
import mockMembers from '../data/members'
import mockRanking from '../data/ranking'
import { Spinner, ErrorState } from '../components/ui/Feedback'
import PlanVotingSection from '../components/ui/PlanVotingSection'
import MembersTab from '../components/ui/MembersTab'
import RankingTab from '../components/ui/RankingTab'

function ParcheDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [searchParams] = useSearchParams()

  const [parche, setParche] = useState(null)
  const [members, setMembers] = useState([])
  const [planes, setPlanes] = useState([])
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('planes')
  const [votosRealizados, setVotosRealizados] = useState({})
  const [attendanceSelections, setAttendanceSelections] = useState({})

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [])

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

      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      const votosIniciales = {}
      planesData.forEach(plan => {
        const votoUsuario = plan.votes?.find(v => v.userId === userId)
        if (votoUsuario) {
          votosIniciales[plan.id] = votoUsuario.planOptionId
        }
      })
      setVotosRealizados(votosIniciales)

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
    if (votosRealizados[planId] === planOptionId) return
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      if (votosRealizados[planId]) {
        await updateVoteService({ userId, planOptionId }, token)
      } else {
        await createVoteService({ userId, planOptionId }, token)
      }
      setVotosRealizados(prev => ({ ...prev, [planId]: planOptionId }))
      setPlanes(prev => prev.map(plan => {
        if (plan.id !== planId) return plan
        const prevVotoId = votosRealizados[planId]
        return {
          ...plan,
          options: plan.options.map(op => {
            if (op.id === planOptionId) return { ...op, voteCount: (op.voteCount || 0) + 1 }
            if (op.id === prevVotoId) return { ...op, voteCount: Math.max((op.voteCount || 0) - 1, 0) }
            return op
          })
        }
      }))
    } catch (err) {
      console.error('Error al votar:', err.message)
    }
  }

  const handleAttendance = async (planId, status) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      await confirmAttendanceService({ userId, PlanId: planId, status }, token)
    } catch (err) {
      console.error('Error al confirmar asistencia:', err.message)
    }
    setAttendanceSelections(prev => ({ ...prev, [planId]: status }))
  }

  const handleChangePlanState = async (planId, nextState) => {
    try {
      await changePlanStateService(planId, nextState, token)
    } catch (err) {
      console.error('Error al cambiar estado:', err.message)
    }
    setPlanes(prev => prev.map(plan =>
      plan.id === planId
        ? { ...plan, state: ['Draft', 'VotingOpen', 'VotingClosed', 'Scheduled'].indexOf(nextState) }
        : plan
    ))
  }

  const handleGetAttendance = async (planId) => {
    return await getAttendanceByPlanService(planId, token)
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

      <header className="bg-dark-800 border border-dark-600 rounded-2xl p-6 mb-6">
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
        <PlanVotingSection
          planes={planes}
          votosRealizados={votosRealizados}
          attendanceSelections={attendanceSelections}
          onVotar={handleVotar}
          onAttendance={handleAttendance}
          onChangePlanState={handleChangePlanState}
          onCrearPlan={() => navigate(`/parches/${id}/planes/nuevo`)}
          onGetAttendance={handleGetAttendance}
          parcheId={id}
        />
      )}

      {activeTab === 'miembros' && (
        <MembersTab members={members} />
      )}

      {activeTab === 'ranking' && (
        <RankingTab ranking={ranking} />
      )}

    </article>
  )
}

export default ParcheDetailPage