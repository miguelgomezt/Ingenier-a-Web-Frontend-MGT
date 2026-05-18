import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { loginService } from '../api/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
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
    if (!form.email) newErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email inválido'
    if (!form.password) newErrors.password = 'La contraseña es requerida'
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
      const data = await loginService({
        Email: form.email,
        Password: form.password
      })
      login(
        { nombreCompleto: form.email, email: form.email },
        data.token
      )
      navigate('/parches')
    } catch (err) {
      setServerError(err.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.email && form.password

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <header className="text-center mb-8">
          <h1 className="font-display font-extrabold text-4xl text-white mb-2">
            Parche<span className="text-brand-500">Plan</span>
          </h1>
          <p className="text-gray-400 text-sm">Inicia sesión para encontrar tu próximo parche</p>
        </header>

        <section
          className="bg-dark-800 border border-dark-600 rounded-2xl p-8"
          aria-label="Formulario de inicio de sesión"
        >
          <h2 className="font-display font-bold text-xl text-white mb-6">Iniciar sesión</h2>

          {serverError && (
            <div role="alert" className="bg-red-900/30 border border-red-700 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Email"
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
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              icon={FiLock}
              required
            />
            <Button
              type="submit"
              disabled={!isValid || loading}
              className="w-full mt-2"
            >
              <FiLogIn size={16} />
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Regístrate
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default LoginPage