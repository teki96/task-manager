import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:3000',
    },
  },
})

const { mockPost, mockUse } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockUse: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: mockPost,
      interceptors: {
        request: { use: mockUse },
      },
    })),
  },
}))

import { authService } from '../../services/authService'

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
  })

  it('should call register API', async () => {
    const userData = { username: 'john', password: '1234' }

    await authService.register(userData)

    expect(mockPost).toHaveBeenCalledWith('/api/users', userData)
  })

  it('should call login API', async () => {
    await authService.login('john', '1234')

    expect(mockPost).toHaveBeenCalledWith('/api/login', {
      username: 'john',
      password: '1234',
    })
  })

  it('should remove token and user from localStorage on logout', () => {
    authService.logout()

    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('user')
  })

  it('should return parsed user from localStorage', () => {
    const user = { id: 1 }
    localStorage.getItem.mockReturnValue(JSON.stringify(user))

    const result = authService.getCurrentUser()

    expect(result).toEqual(user)
  })

  it('should return null if no user in localStorage', () => {
    localStorage.getItem.mockReturnValue(null)

    const result = authService.getCurrentUser()

    expect(result).toBeNull()
  })

  it('should return token from localStorage', () => {
    localStorage.getItem.mockReturnValue('abc123')

    expect(authService.getToken()).toBe('abc123')
  })

  it('should return true if authenticated', () => {
    localStorage.getItem.mockReturnValue('abc123')

    expect(authService.isAuthenticated()).toBe(true)
  })

  it('should return false if not authenticated', () => {
    localStorage.getItem.mockReturnValue(null)

    expect(authService.isAuthenticated()).toBe(false)
  })
})
