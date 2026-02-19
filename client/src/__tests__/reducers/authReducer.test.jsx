import { describe, it, expect } from 'vitest'
import authReducer from '../../reducers/authReducer'

describe('authReducer', () => {
  const initialState = {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
  }

  it('handles LOGIN_START', () => {
    const action = { type: 'LOGIN_START' }

    const state = authReducer(initialState, action)

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null,
    })
  })

  it('handles LOGIN_SUCCESS', () => {
    const action = {
      type: 'LOGIN_SUCCESS',
      payload: {
        user: { username: 'john', name: 'John Doe' },
        token: 'abc123',
      },
    }

    const state = authReducer(initialState, action)

    expect(state).toEqual({
      ...initialState,
      user: { username: 'john', name: 'John Doe' },
      token: 'abc123',
      isLoading: false,
      isAuthenticated: true,
      error: null,
    })
  })

  it('handles LOGIN_ERROR', () => {
    const action = {
      type: 'LOGIN_ERROR',
      payload: 'Invalid credentials',
    }

    const state = authReducer(initialState, action)

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Invalid credentials',
    })
  })

  it('handles SET_USER', () => {
    const action = {
      type: 'SET_USER',
      payload: { username: 'john', name: 'John Doe' },
    }

    const state = authReducer(initialState, action)

    expect(state).toEqual({
      ...initialState,
      user: { username: 'john', name: 'John Doe' },
      isAuthenticated: true,
    })
  })

  it('handles LOGOUT', () => {
    const loggedInState = {
      user: { username: 'john', name: 'John Doe' },
      token: 'abc123',
      isLoading: false,
      isAuthenticated: true,
      error: null,
    }

    const action = { type: 'LOGOUT' }

    const state = authReducer(loggedInState, action)

    expect(state).toEqual(initialState)
  })

  it('returns current state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' }

    const state = authReducer(initialState, action)

    expect(state).toEqual(initialState)
  })
})
