const BASE_URL = '/api/Parche'

export async function getParchesService(token) {
  const response = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Error al obtener parches')
  return response.json()
}

export async function getParcheByIdService(id, token) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Parche no encontrado')
  return response.json()
}

export async function createParcheService(parcheDTO, token) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(parcheDTO),
  })
  if (!response.ok) throw new Error('Error al crear parche')
  return response.json()
}

export async function joinParcheService(inviteCode, token) {
  const response = await fetch(`${BASE_URL}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ inviteCode }),
  })
  if (!response.ok) throw new Error('Código de invitación inválido')
  return response.json()
}

export async function getParcheMembersService(parcheId, token) {
  const response = await fetch(`${BASE_URL}/${parcheId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Error al obtener miembros')
  return response.json()
}