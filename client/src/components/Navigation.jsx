import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Button } from './ui/button'

export const Navigation = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xl font-bold text-gray-900"
          >
            <span className="text-2xl">📋</span>
            Task Manager
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Welcome, <span className="font-semibold">{user?.username}</span>
            </span>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 w-20 h-8 text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
