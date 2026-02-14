import { createContext, useReducer, useEffect } from 'react'
import authReducer from '../reducers/authReducer'
import { authService } from '../services/authService'

export const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      dispatch({
        type: 'SET_USER',
        payload: JSON.parse(user),
      })
    }
  }, [])

  const login = async (username, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await authService.login(username, password)
      const { token, username: user, name } = response.data

      const userData = { username: user, name }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: userData, token },
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' })
    try {
      await authService.register(userData)
      dispatch({ type: 'REGISTER_SUCCESS' })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      dispatch({
        type: 'REGISTER_ERROR',
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    authService.logout()
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
