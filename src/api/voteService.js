const BASE_URL = '/api/Vote'

const fetchWithTimeout = (url, options, timeout = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('El servidor no responde.')), timeout)
    )
  ])
}

export async function createVoteService(voteDTO, token) {
  const response = await fetchWithTimeout(`${BASE_URL}?userId=${voteDTO.userId}&optionId=${voteDTO.planOptionId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Error al votar')
  }
  return true
}

export async function updateVoteService(voteDTO, token) {
  const response = await fetchWithTimeout(`${BASE_URL}?userId=${voteDTO.userId}&optionId=${voteDTO.planOptionId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Error al cambiar voto')
  }
  return true
}

export async function getVoteResultsService(planId, token) {
  const response = await fetchWithTimeout(`${BASE_URL}/results/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Error al obtener resultados')
  return response.json()
}