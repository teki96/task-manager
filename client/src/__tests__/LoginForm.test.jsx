import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithRouter, screen, userEvent } from './test-utils'
import { LoginForm } from '../components/LoginForm'
import { AuthContext } from '../context/AuthContext'

// Mock useNavigate
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('LoginForm', () => {
  const mockLogin = vi.fn()

  const renderWithAuth = (overrides = {}) => {
    const defaultContext = {
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    }

    return renderWithRouter(
      <AuthContext.Provider value={{ ...defaultContext, ...overrides }}>
        <LoginForm />
      </AuthContext.Provider>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    renderWithAuth()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
  })

  it('shows validation error when fields are empty', async () => {
    const user = userEvent.setup()
    renderWithAuth()

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()

    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('calls login and navigates on successful login', async () => {
    const user = userEvent.setup()

    mockLogin.mockResolvedValue({ success: true })

    renderWithAuth()

    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123')
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('shows error message when login fails', async () => {
    const user = userEvent.setup()

    mockLogin.mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    })

    renderWithAuth()

    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('disables inputs and shows loading state', () => {
    renderWithAuth({ isLoading: true })

    const button = screen.getByRole('button')
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(button).toBeDisabled()
    expect(usernameInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
    expect(screen.getByText('Logging in...')).toBeInTheDocument()
  })

  it('renders register link', () => {
    renderWithAuth()
    expect(screen.getByText(/register here/i)).toBeInTheDocument()
  })
})
