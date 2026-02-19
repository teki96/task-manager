import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, AuthContext } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import { useContext } from 'react'

vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}))

const TestComponent = () => {
  const { user, error, isAuthenticated, login, register, logout } =
    useContext(AuthContext)

  return (
    <div>
      <button onClick={() => login('john', 'password')}>Login</button>

      <button
        onClick={() => register({ username: 'john', password: 'password' })}
      >
        Register
      </button>

      <button onClick={logout}>Logout</button>

      <div data-testid="user">{user ? user.username : ''}</div>

      <div data-testid="auth">{isAuthenticated ? 'true' : 'false'}</div>

      <div data-testid="error">{error}</div>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('loads user from localStorage on mount', () => {
    localStorage.setItem('token', 'abc123')
    localStorage.setItem(
      'user',
      JSON.stringify({ username: 'john', name: 'John Doe' }),
    )

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    expect(screen.getByTestId('user').textContent).toBe('john')
  })

  it('login success', async () => {
    authService.login.mockResolvedValue({
      data: {
        token: 'abc123',
        username: 'john',
        name: 'John Doe',
      },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await userEvent.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('john', 'password')
      expect(localStorage.getItem('token')).toBe('abc123')
      expect(screen.getByTestId('user').textContent).toBe('john')
      expect(screen.getByTestId('auth').textContent).toBe('true')
    })
  })

  it('login error', async () => {
    authService.login.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await userEvent.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe(
        'Invalid credentials',
      )
    })
  })

  it('register success', async () => {
    authService.register.mockResolvedValue({})

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await userEvent.click(screen.getByText('Register'))

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled()
    })
  })

  it('register error', async () => {
    authService.register.mockRejectedValue({
      response: { data: { error: 'Registration failed' } },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await userEvent.click(screen.getByText('Register'))

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe(
        'Registration failed',
      )
    })
  })

  it('logout calls service and clears auth state', async () => {
    authService.login.mockResolvedValue({
      data: {
        token: 'abc123',
        username: 'john',
        name: 'John Doe',
      },
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await userEvent.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('true')
    })

    await userEvent.click(screen.getByText('Logout'))

    expect(authService.logout).toHaveBeenCalled()
  })
})
