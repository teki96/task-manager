const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }

    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      }

    case 'REGISTER_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    case 'LOGOUT':
      return {
        ...initialState,
      }

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      }

    default:
      return state
  }
}

export default authReducer
