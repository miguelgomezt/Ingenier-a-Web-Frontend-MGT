const BASE_URL = '/api/Attendance'

export async function confirmAttendanceService(attendanceDTO, token) {
  const response = await fetch(`${BASE_URL}/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(attendanceDTO),
  })
  if (!response.ok) throw new Error('Error al confirmar asistencia')
  return response.json()
}

export async function getAttendanceByPlanService(planId, token) {
  const response = await fetch(`${BASE_URL}/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Error al obtener asistencia')
  return response.json()
}