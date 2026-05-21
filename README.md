# ParchePlan U — Frontend
ParchePlan U es una aplicación web para organizar planes entre estudiantes universitarios. Permite crear grupos (parches), proponer planes, votar por la mejor opción y confirmar asistencia.
## Funcionalidades
- Registro e inicio de sesión con autenticación JWT
- Crear parches y unirse con código de invitación
- Crear planes con múltiples opciones de lugar y hora
- Votar en tiempo real con barras de progreso
- Confirmar asistencia (Voy / No voy / Tal vez)
- Ver lista de asistencia por plan
- Ver miembros del parche con sus roles (Owner, Moderador, Miembro)
- Ver ranking de participación con Organizer Score y Ghost Score
  ## Tecnologías
- React 18 + Vite
- Tailwind CSS
- React Router v6
- React Icons
- JWT para autenticación
## Instalación y ejecución
```bash
npm install
npm run dev
```
## Conexión con el backend

El proxy de Vite redirige `/api/*` al backend en `https://localhost:7163`. Configurable en `vite.config.js`.

---

## Autor

Miguel Gómez Tobón
