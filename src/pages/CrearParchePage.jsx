import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiImage } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { createParcheService } from '../api/parcheService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

function CrearParchePage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    Name: '',
    Description: '',
    CoverImageUrl: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.Name.trim()) newErrors.Name = 'El nombre es requerido'
    if (!form.Description.trim()) newErrors.Description = 'La descripción es requerida'
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
      await createParcheService({
        Name: form.Name,
        Description: form.Description,
        CoverImageUrl: form.CoverImageUrl || null,
      }, token)
      navigate('/parches')
    } catch {
      navigate('/parches')
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.Name && form.Description

  return (
    <section aria-label="Crear nuevo parche" className="max-w-lg mx-auto">

      <button
        onClick={() => navigate('/parches')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <FiArrowLeft size={16} /> Volver
      </button>

      <header className="mb-6">
        <h1 className="font-display font-extrabold text-2xl text-white">Crear parche</h1>
        <p className="text-gray-400 text-sm mt-1">Organiza un grupo y reúne gente</p>
      </header>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 animate-slide-up">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Nombre del parche"
            name="Name"
            value={form.Name}
            onChange={handleChange}
            error={errors.Name}
            placeholder="Ej: Tarde de microfútbol"
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
              onChange={handleChange}
              placeholder="¿De qué va el parche?"
              rows={3}
              className={`w-full bg-dark-700 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-all ${
                errors.Description ? 'border-red-500' : 'border-dark-600'
              }`}
            />
            {errors.Description && (
              <p className="text-xs text-red-400">{errors.Description}</p>
            )}
          </div>

          <Input
            label="URL de imagen de portada (opcional)"
            name="CoverImageUrl"
            value={form.CoverImageUrl}
            onChange={handleChange}
            placeholder="https://..."
            icon={FiImage}
          />

          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full mt-2"
          >
            {loading ? 'Creando...' : 'Crear parche'}
          </Button>
        </form>
      </div>
    </section>
  )
}

export default CrearParchePage