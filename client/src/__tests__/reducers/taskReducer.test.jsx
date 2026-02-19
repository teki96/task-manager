import { describe, it, expect } from 'vitest'
import taskReducer from '../../reducers/taskReducer'

describe('taskReducer', () => {
  const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
  }

  it('handles FETCH_TASKS_START', () => {
    const action = { type: 'FETCH_TASKS_START' }

    const state = taskReducer(initialState, action)

    expect(state.isLoading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('handles FETCH_TASKS_SUCCESS', () => {
    const tasks = [
      { id: '1', title: 'Task 1' },
      { id: '2', title: 'Task 2' },
    ]

    const action = {
      type: 'FETCH_TASKS_SUCCESS',
      payload: tasks,
    }

    const state = taskReducer(initialState, action)

    expect(state.isLoading).toBe(false)
    expect(state.tasks).toEqual(tasks)
    expect(state.error).toBeNull()
  })

  it('handles FETCH_TASKS_ERROR', () => {
    const action = {
      type: 'FETCH_TASKS_ERROR',
      payload: 'Fetch failed',
    }

    const state = taskReducer(initialState, action)

    expect(state.isLoading).toBe(false)
    expect(state.error).toBe('Fetch failed')
  })

  it('handles CREATE_TASK_SUCCESS (adds to beginning)', () => {
    const existingState = {
      ...initialState,
      tasks: [{ id: '1', title: 'Old Task' }],
    }

    const newTask = { id: '2', title: 'New Task' }

    const action = {
      type: 'CREATE_TASK_SUCCESS',
      payload: newTask,
    }

    const state = taskReducer(existingState, action)

    expect(state.tasks).toHaveLength(2)
    expect(state.tasks[0]).toEqual(newTask)
  })

  it('handles UPDATE_TASK_SUCCESS', () => {
    const existingState = {
      ...initialState,
      tasks: [
        { id: '1', title: 'Old Task' },
        { id: '2', title: 'Another Task' },
      ],
    }

    const updatedTask = { id: '1', title: 'Updated Task' }

    const action = {
      type: 'UPDATE_TASK_SUCCESS',
      payload: updatedTask,
    }

    const state = taskReducer(existingState, action)

    expect(state.tasks[0].title).toBe('Updated Task')
    expect(state.tasks[1].title).toBe('Another Task')
  })

  it('handles DELETE_TASK_SUCCESS', () => {
    const existingState = {
      ...initialState,
      tasks: [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
      ],
    }

    const action = {
      type: 'DELETE_TASK_SUCCESS',
      payload: '1',
    }

    const state = taskReducer(existingState, action)

    expect(state.tasks).toHaveLength(1)
    expect(state.tasks[0].id).toBe('2')
  })

  it('handles CLEAR_ERROR', () => {
    const errorState = {
      ...initialState,
      error: 'Some error',
    }

    const action = { type: 'CLEAR_ERROR' }

    const state = taskReducer(errorState, action)

    expect(state.error).toBeNull()
  })

  it('returns current state for unknown action', () => {
    const action = { type: 'UNKNOWN' }

    const state = taskReducer(initialState, action)

    expect(state).toEqual(initialState)
  })
})
