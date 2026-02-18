import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RegisterForm } from '../../components/RegisterForm'
import { AuthContext } from '../../context/AuthContext'

// mock useNavigate
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderComponent = (contextOverrides = {}) => {
  const defaultContext = {
    register: vi.fn(),
    isLoading: false,
    error: null,
  }

  return render(
    <AuthContext.Provider value={{ ...defaultContext, ...contextOverrides }}>
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows error if fields are empty', async () => {
    renderComponent()

    await userEvent.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
  })

  it('shows error if username is too short', async () => {
    renderComponent()

    await userEvent.type(screen.getByLabelText(/username/i), 'ab')
    await userEvent.type(screen.getByLabelText(/^password$/i), '123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), '123')

    await userEvent.click(screen.getByRole('button', { name: /register/i }))

    expect(
      screen.getByText('Username must be at least 3 characters long'),
    ).toBeInTheDocument()
  })

  it('shows error if passwords do not match', async () => {
    renderComponent()

    await userEvent.type(screen.getByLabelText(/username/i), 'john')
    await userEvent.type(screen.getByLabelText(/^password$/i), '123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), '456')

    await userEvent.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })

  it('shows error if password too short', async () => {
    renderComponent()

    await userEvent.type(screen.getByLabelText(/username/i), 'john')
    await userEvent.type(screen.getByLabelText(/^password$/i), '12')
    await userEvent.type(screen.getByLabelText(/confirm password/i), '12')

    await userEvent.click(screen.getByRole('button', { name: /register/i }))

    expect(
      screen.getByText('Password must be at least 3 characters long'),
    ).toBeInTheDocument()
  })

  it('calls register with correct data on valid submission', async () => {
    const mockRegister = vi.fn().mockResolvedValue({ success: true })

    renderComponent({ register: mockRegister })

    await userEvent.type(screen.getByLabelText(/username/i), 'john')
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe')
    await userEvent.type(screen.getByLabelText(/^password$/i), '123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), '123')

    await userEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'john',
        name: 'John Doe',
        password: '123',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('shows error if register fails', async () => {
    const mockRegister = vi
      .fn()
      .mockResolvedValue({ success: false, error: 'User exists' })

    renderComponent({ register: mockRegister })

    await userEvent.type(screen.getByLabelText(/username/i), 'john')
    await userEvent.type(screen.getByLabelText(/^password$/i), '123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), '123')

    await userEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText('User exists')).toBeInTheDocument()
    })
  })
})
