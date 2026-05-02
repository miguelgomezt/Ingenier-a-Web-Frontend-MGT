import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ParchesPage from './pages/ParchesPage'
import ParcheDetailPage from './pages/ParcheDetailPage'
import CrearParchePage from './pages/CrearParchePage'
import CrearPlanPage from './pages/CrearPlanPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/parches" replace />} />
          <Route path="parches" element={<ParchesPage />} />
          <Route path="parches/nuevo" element={<CrearParchePage />} />
          <Route path="parches/:id/planes/nuevo" element={<CrearPlanPage />} />
          <Route path="parches/:id" element={<ParcheDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App