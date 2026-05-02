import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function MainLayout() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main
        className="max-w-6xl mx-auto px-4 pt-24 pb-24 md:pb-8"
        id="main-content"
      >
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout