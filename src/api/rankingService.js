const BASE_URL = '/api/Ranking'

export async function getRankingByParcheService(parcheId, token) {
  const response = await fetch(`${BASE_URL}/${parcheId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Error al obtener el ranking')
  return response.json()
}