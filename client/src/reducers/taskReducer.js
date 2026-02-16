const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
}

export const taskReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_TASKS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: action.payload,
        error: null,
      }

    case 'FETCH_TASKS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    case 'CREATE_TASK_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case 'CREATE_TASK_SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: [action.payload, ...state.tasks],
        error: null,
      }

    case 'CREATE_TASK_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    case 'UPDATE_TASK_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case 'UPDATE_TASK_SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        ),
        error: null,
      }

    case 'UPDATE_TASK_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    case 'DELETE_TASK_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case 'DELETE_TASK_SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        error: null,
      }

    case 'DELETE_TASK_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export default taskReducer
