const BASE_URL = '/api/Vote'

export async function createVoteService(voteDTO, token) {
  const response = await fetch(`${BASE_URL}?userId=${voteDTO.userId}&optionId=${voteDTO.planOptionId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error('Error al votar')
  return response.json()
}

export async function updateVoteService(voteDTO, token) {
  const response = await fetch(`${BASE_URL}?userId=${voteDTO.userId}&optionId=${voteDTO.planOptionId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error('Error al cambiar voto')
  return response.json()
}

export async function getVoteResultsService(planId, token) {
  const response = await fetch(`${BASE_URL}/results/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Error al obtener resultados')
  return response.json()
}