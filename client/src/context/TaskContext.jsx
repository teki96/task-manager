import { createContext, useReducer, useCallback } from 'react'
import taskReducer from '../reducers/taskReducer'
import { taskService } from '../services/taskService'

export const TaskContext = createContext()

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'FETCH_TASKS_START' })
    try {
      const response = await taskService.getTasks()
      dispatch({
        type: 'FETCH_TASKS_SUCCESS',
        payload: response.data,
      })
      return { success: true }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed to fetch tasks'
      dispatch({
        type: 'FETCH_TASKS_ERROR',
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }, [])

  const createTask = useCallback(async (taskData) => {
    dispatch({ type: 'CREATE_TASK_START' })
    try {
      const response = await taskService.createTask(taskData)
      dispatch({
        type: 'CREATE_TASK_SUCCESS',
        payload: response.data,
      })
      return { success: true, task: response.data }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed to create task'
      dispatch({
        type: 'CREATE_TASK_ERROR',
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }, [])

  const updateTask = useCallback(async (id, taskData) => {
    dispatch({ type: 'UPDATE_TASK_START' })
    try {
      const response = await taskService.updateTask(id, taskData)
      dispatch({
        type: 'UPDATE_TASK_SUCCESS',
        payload: response.data,
      })
      return { success: true, task: response.data }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed to update task'
      dispatch({
        type: 'UPDATE_TASK_ERROR',
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }, [])

  const deleteTask = useCallback(async (id) => {
    dispatch({ type: 'DELETE_TASK_START' })
    try {
      await taskService.deleteTask(id)
      dispatch({
        type: 'DELETE_TASK_SUCCESS',
        payload: id,
      })
      return { success: true }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed to delete task'
      dispatch({
        type: 'DELETE_TASK_ERROR',
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
