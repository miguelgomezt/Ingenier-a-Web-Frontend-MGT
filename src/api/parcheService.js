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
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
  const payload = JSON.parse(atob(token.split('.')[1]))
  const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']

  const response = await fetch(`${BASE_URL}?creatorId=${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Name: parcheDTO.Name,
      Description: parcheDTO.Description,
      CoverImageUrl: parcheDTO.CoverImageUrl || '',
      InviteCode: inviteCode,
    }),
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Error al crear parche')
  }
  return response.json()
}

export async function joinParcheService(inviteCode, token) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
  const response = await fetch(`${BASE_URL}/join?userId=${userId}&inviteCode=${inviteCode}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Código de invitación inválido')
  }
  return true
}

export async function getParcheMembersService(parcheId, token) {
  const response = await fetch(`${BASE_URL}/${parcheId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Error al obtener miembros')
  return response.json()
}