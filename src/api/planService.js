const BASE_URL = '/api/Plan'

export async function getPlanesByParcheService(parcheId, token) {
  const response = await fetch(`${BASE_URL}/parche/${parcheId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Error al obtener planes')
  return response.json()
}

export async function getPlanByIdService(id, token) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Plan no encontrado')
  return response.json()
}

export async function createPlanService(planDTO, token) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(planDTO),
  })
  if (!response.ok) throw new Error('Error al crear plan')
  return response.json()
}

export async function changePlanStateService(planId, newState, token) {
  const response = await fetch(`${BASE_URL}/${planId}/state`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ state: newState }),
  })
  if (!response.ok) throw new Error('Error al cambiar estado del plan')
  return response.json()
}