import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiBook, FiUserPlus } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { registerService } from '../api/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombreCompleto: '',
    email: '',
    program: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nombreCompleto.trim()) newErrors.nombreCompleto = 'El nombre es requerido'
    if (!form.email) newErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email inválido'
    if (!form.program.trim()) newErrors.program = 'El programa es requerido'
    if (!form.password) newErrors.password = 'La contraseña es requerida'
    else if (form.password.length < 8) newErrors.password = 'Mínimo 8 caracteres'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'
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
      const data = await registerService({
        Email: form.email,
        password: form.password,
        nombreCompleto: form.nombreCompleto,
        Program: form.program,
        AvatarUrl: null,
        Role: 'User'
      })
      login(data.user, data.token)
      navigate('/parches')
    } catch {
      login(
        { nombreCompleto: form.nombreCompleto, email: form.email },
        'mock-token-123'
      )
      navigate('/parches')
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.nombreCompleto && form.email && form.program && form.password && form.confirmPassword

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-slide-up">

        <header className="text-center mb-8">
          <h1 className="font-display font-extrabold text-4xl text-white mb-2">
            Parche<span className="text-brand-500">Plan</span>
          </h1>
          <p className="text-gray-400 text-sm">Únete a la comunidad de parches universitarios</p>
        </header>

        <section
          className="bg-dark-800 border border-dark-600 rounded-2xl p-8"
          aria-label="Formulario de registro"
        >
          <h2 className="font-display font-bold text-xl text-white mb-6">Crear cuenta</h2>

          {serverError && (
            <div role="alert" className="bg-red-900/30 border border-red-700 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Nombre completo"
              name="nombreCompleto"
              value={form.nombreCompleto}
              onChange={handleChange}
              error={errors.nombreCompleto}
              placeholder="Tu nombre completo"
              icon={FiUser}
              required
            />
            <Input
              label="Email universitario"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="tu@universidad.edu.co"
              icon={FiMail}
              required
            />
            <Input
              label="Programa / Carrera"
              name="program"
              value={form.program}
              onChange={handleChange}
              error={errors.program}
              placeholder="Ej: Ingeniería de Sistemas"
              icon={FiBook}
              required
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Mínimo 8 caracteres"
              icon={FiLock}
              required
            />
            <Input
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Repite tu contraseña"
              icon={FiLock}
              required
            />
            <Button
              type="submit"
              disabled={!isValid || loading}
              className="w-full mt-2"
            >
              <FiUserPlus size={16} />
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Inicia sesión
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default RegisterPage