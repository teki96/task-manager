import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { AuthContext } from '../../context/AuthContext'

const renderWithAuth = (isAuthenticated) => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated }}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects to login if not authenticated', () => {
    renderWithAuth(false)

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders children if authenticated', () => {
    renderWithAuth(true)

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
