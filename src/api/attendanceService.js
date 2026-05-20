const BASE_URL = '/api/Attendance'

export async function confirmAttendanceService(attendanceDTO, token) {
  const response = await fetch(
    `${BASE_URL}/confirm?userId=${attendanceDTO.userId}&planId=${attendanceDTO.PlanId}&status=${attendanceDTO.status}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Error al confirmar asistencia')
  }
  return true
}

export async function getAttendanceByPlanService(planId, token) {
  const response = await fetch(`${BASE_URL}/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Error al obtener asistencia')
  return response.json()
}