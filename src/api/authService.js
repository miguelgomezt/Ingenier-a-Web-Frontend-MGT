const BASE_URL = '/api/Auth'

const fetchWithTimeout = (url, options, timeout = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('El servidor no responde. Verifica que el backend esté corriendo.')), timeout)
    )
  ])
}

export async function loginService(loginDTO) {
  const response = await fetchWithTimeout(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginDTO),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Credenciales incorrectas')
  }
  return response.json()
}

export async function registerService(registerDTO) {
  const response = await fetchWithTimeout(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerDTO),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Error al registrarse')
  }
  return response.json()
}