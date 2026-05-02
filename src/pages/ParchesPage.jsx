import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiPlus, FiHash } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { getParchesService, joinParcheService } from '../api/parcheService'
import mockParches from '../Data/parches'
import ParcheCard from '../components/ui/ParcheCard'
import Button from '../components/ui/Button'
import { Spinner, EmptyState, ErrorState } from '../components/ui/Feedback'

function ParchesPage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [parches, setParches] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [inviteCode, setInviteCode] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [joinSuccess, setJoinSuccess] = useState('')

  const fetchParches = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getParchesService(token)
      setParches(data)
    } catch {
      setParches(mockParches)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParches()
  }, [])

  const parchesFiltrados = parches.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.description.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!inviteCode.trim()) return
    setJoinLoading(true)
    setJoinError('')
    setJoinSuccess('')
    try {
      await joinParcheService(inviteCode.trim(), token)
      setJoinSuccess('¡Te uniste al parche exitosamente!')
      setInviteCode('')
      fetchParches()
    } catch (err) {
      setJoinError(err.message || 'Código inválido')
    } finally {
      setJoinLoading(false)
    }
  }

  return (
    <section aria-label="Lista de parches">

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white">Parches</h1>
          <p className="text-gray-400 text-sm mt-1">{parches.length} parches disponibles</p>
        </div>
        <Button onClick={() => navigate('/parches/nuevo')}>
          <FiPlus size={16} />
          Crear parche
        </Button>
      </header>

      {/* Unirse con código de invitación */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 mb-6">
        <h2 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
          <FiHash size={16} className="text-brand-400" />
          Unirse con código
        </h2>
        <form onSubmit={handleJoin} noValidate className="flex gap-3">
          <input
            type="text"
            value={inviteCode}
            onChange={e => {
              setInviteCode(e.target.value)
              setJoinError('')
              setJoinSuccess('')
            }}
            placeholder="Escribe el código de invitación"
            aria-label="Código de invitación"
            className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          <Button
            type="submit"
            disabled={!inviteCode.trim() || joinLoading}
          >
            {joinLoading ? 'Uniéndose...' : 'Unirse'}
          </Button>
        </form>
        {joinError && (
          <p role="alert" className="text-xs text-red-400 mt-2">{joinError}</p>
        )}
        {joinSuccess && (
          <p role="status" className="text-xs text-green-400 mt-2">{joinSuccess}</p>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar parches..."
          aria-label="Buscar parches"
          className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
        />
      </div>

      {/* Contenido */}
      {loading && <Spinner className="py-16" />}
      {!loading && error && <ErrorState message={error} onRetry={fetchParches} />}
      {!loading && !error && parchesFiltrados.length === 0 && (
        <EmptyState
          title="Sin parches"
          description={busqueda ? `No hay parches que coincidan con "${busqueda}"` : 'No hay parches disponibles aún.'}
          action={<Button onClick={() => navigate('/parches/nuevo')}>Crear el primero</Button>}
        />
      )}
      {!loading && !error && parchesFiltrados.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {parchesFiltrados.map(parche => (
            <li key={parche.id}>
              <ParcheCard parche={parche} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ParchesPage