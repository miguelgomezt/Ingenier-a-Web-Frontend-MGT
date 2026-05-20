import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiTrash2, FiMapPin, FiCalendar } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { createPlanService } from '../api/planService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const emptyOption = () => ({ Place: '', Time: '' })

function CrearPlanPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    Description: '',
    StartVoting: '',
    EndVoting: '',
  })
  const [options, setOptions] = useState([
    emptyOption(),
    emptyOption(),
    emptyOption(),
  ])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleOptionChange = (index, field, value) => {
    setOptions(prev => prev.map((opt, i) =>
      i === index ? { ...opt, [field]: value } : opt
    ))
    if (errors[`option_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`option_${index}_${field}`]: '' }))
    }
  }

  const addOption = () => {
    setOptions(prev => [...prev, emptyOption()])
  }

  const removeOption = (index) => {
    if (options.length <= 3) return
    setOptions(prev => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'El título es requerido'
    if (!form.Description.trim()) newErrors.Description = 'La descripción es requerida'
    if (!form.StartVoting) newErrors.StartVoting = 'La fecha de inicio es requerida'
    if (!form.EndVoting) newErrors.EndVoting = 'La fecha de fin es requerida'
    if (form.StartVoting && form.EndVoting && form.StartVoting >= form.EndVoting) {
      newErrors.EndVoting = 'La fecha de fin debe ser después del inicio'
    }
    options.forEach((opt, index) => {
      if (!opt.Place.trim()) newErrors[`option_${index}_Place`] = 'El lugar es requerido'
      if (!opt.Time) newErrors[`option_${index}_Time`] = 'La hora es requerida'
    })
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      await createPlanService({
        ParcheId: parseInt(id),
        Title: form.title,
        Description: form.Description,
        StartVoting: form.StartVoting,
        EndVoting: form.EndVoting,
        CreatorId: userId,
        Options: options.map(opt => ({
          Lugar: opt.Place,
          Time: opt.Time,
        }))
      }, token)
      navigate(`/parches/${id}`)
    } catch (err) {
      setServerError(err.message || 'Error al crear el plan')
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.title && form.Description && form.StartVoting && form.EndVoting &&
    options.every(opt => opt.Place && opt.Time)

  return (
    <section aria-label="Crear nuevo plan" className="max-w-lg mx-auto">

      <button
        onClick={() => navigate(`/parches/${id}`)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <FiArrowLeft size={16} /> Volver al parche
      </button>

      <header className="mb-6">
        <h1 className="font-display font-extrabold text-2xl text-white">Crear plan</h1>
        <p className="text-gray-400 text-sm mt-1">Define las opciones y abre la votación</p>
      </header>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 animate-slide-up">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          <Input
            label="Título del plan"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            error={errors.title}
            placeholder="Ej: ¿Cuándo y dónde nos reunimos?"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="Description" className="text-sm font-display font-semibold text-gray-300">
              Descripción <span className="text-brand-400">*</span>
            </label>
            <textarea
              id="Description"
              name="Description"
              value={form.Description}
              onChange={handleFormChange}
              placeholder="Explica de qué trata este plan"
              rows={2}
              className={`w-full !bg-dark-700 !text-white border border-dark-600 rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none ${
                errors.Description ? 'border-red-500' : ''
              }`}
            />
            {errors.Description && (
              <p className="text-xs text-red-400">{errors.Description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Inicio de votación"
              name="StartVoting"
              type="datetime-local"
              value={form.StartVoting}
              onChange={handleFormChange}
              error={errors.StartVoting}
              icon={FiCalendar}
              required
            />
            <Input
              label="Fin de votación"
              name="EndVoting"
              type="datetime-local"
              value={form.EndVoting}
              onChange={handleFormChange}
              error={errors.EndVoting}
              icon={FiCalendar}
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-display font-semibold text-gray-300">
                Opciones <span className="text-brand-400">*</span>
                <span className="text-gray-500 font-normal ml-1">(mínimo 3)</span>
              </p>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                <FiPlus size={14} /> Agregar opción
              </button>
            </div>

            {options.map((opt, index) => (
              <div
                key={index}
                className="bg-dark-700 border border-dark-600 rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400">Opción {index + 1}</p>
                  {options.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      aria-label={`Eliminar opción ${index + 1}`}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>

                <Input
                  label="Lugar"
                  name={`place_${index}`}
                  value={opt.Place}
                  onChange={e => handleOptionChange(index, 'Place', e.target.value)}
                  error={errors[`option_${index}_Place`]}
                  placeholder="Ej: Cualquier zona de la universidad"
                  icon={FiMapPin}
                  required
                />
                <Input
                  label="Fecha y hora"
                  name={`time_${index}`}
                  type="datetime-local"
                  value={opt.Time}
                  onChange={e => handleOptionChange(index, 'Time', e.target.value)}
                  error={errors[`option_${index}_Time`]}
                  icon={FiCalendar}
                  required
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full mt-2"
          >
            {loading ? 'Creando plan...' : 'Crear plan'}
          </Button>
        </form>
      </div>
    </section>
  )
}

export default CrearPlanPage