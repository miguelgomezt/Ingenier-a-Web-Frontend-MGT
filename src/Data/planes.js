// El PlanState lo definimos con tres numeros: 0 = Draft, 1 = VotingOpen, 2 = VotingClosed, 3 = Scheduled
const planes = [
    {
      id: 1,
      parcheId: 1,
      title: "¿Cuándo y dónde jugamos?",
      description: "Vota por tu opción preferida de lugar y hora.",
      state: 1,
      votingDeadline: "2025-05-09T23:59:00",
      options: [
        { id: 1, planId: 1, place: "Cancha de microfutbol", time: "2025-05-10T15:00:00", voteCount: 5 },
        { id: 2, planId: 1, place: "Cancha futbol 11 EIA", time: "2025-05-10T17:00:00", voteCount: 3 },
        { id: 3, planId: 1, place: "Cancha por fuera de la EIA", time: "2025-05-11T10:00:00", voteCount: 2 }
      ]
    },
    {
      id: 2,
      parcheId: 2,
      title: "Fogata en la U",
      description: "Hacemos diferentes actividades para la integracion de los nuevos en la U.",
      state: 0,
      votingDeadline: "2025-05-10T23:59:00",
      options: [
        { id: 4, planId: 2, place: "Afuera de la Biblioteca", time: "2025-05-12T09:00:00", voteCount: 0 },
        { id: 5, planId: 2, place: "En la cancha de futbol 11", time: "2025-05-12T10:00:00", voteCount: 0 },
        { id: 6, planId: 2, place: "Al lado del lago", time: "2025-05-12T11:00:00", voteCount: 0 }
      ]
    }
  ]
  
  export default planes