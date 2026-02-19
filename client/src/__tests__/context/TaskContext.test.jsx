import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskProvider, TaskContext } from '../../context/TaskContext'
import { taskService } from '../../services/taskService'
import { useContext } from 'react'

vi.mock('../../services/taskService', () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}))

const TestComponent = () => {
  const {
    tasks,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  } = useContext(TaskContext)

  return (
    <div>
      <button onClick={() => fetchTasks()}>Fetch</button>
      <button onClick={() => createTask({ title: 'New Task' })}>Create</button>
      <button onClick={() => updateTask('1', { title: 'Updated' })}>
        Update
      </button>
      <button onClick={() => deleteTask('1')}>Delete</button>
      <button onClick={clearError}>Clear</button>

      <div data-testid="tasks">{JSON.stringify(tasks)}</div>
      <div data-testid="error">{error}</div>
    </div>
  )
}

describe('TaskContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchTasks success', async () => {
    taskService.getTasks.mockResolvedValue({
      data: [{ id: '1', title: 'Task 1' }],
    })

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>,
    )

    await userEvent.click(screen.getByText('Fetch'))

    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalled()
      expect(screen.getByTestId('tasks').textContent).toContain('Task 1')
    })
  })

  it('fetchTasks error', async () => {
    taskService.getTasks.mockRejectedValue({
      response: { data: { error: 'Fetch failed' } },
    })

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>,
    )

    await userEvent.click(screen.getByText('Fetch'))

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Fetch failed')
    })
  })

  it('createTask success', async () => {
    taskService.createTask.mockResolvedValue({
      data: { id: '1', title: 'New Task' },
    })

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>,
    )

    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalled()
      expect(screen.getByTestId('tasks').textContent).toContain('New Task')
    })
  })

  it('updateTask success', async () => {
    taskService.updateTask.mockResolvedValue({
      data: { id: '1', title: 'Updated' },
    })

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>,
    )

    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(taskService.updateTask).toHaveBeenCalledWith('1', {
        title: 'Updated',
      })
    })
  })

  it('deleteTask success', async () => {
    taskService.deleteTask.mockResolvedValue({})

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>,
    )

    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith('1')
    })
  })

  it('clearError resets error', async () => {
    taskService.getTasks.mockRejectedValue({
      response: { data: { error: 'Some error' } },
    })

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>,
    )

    await userEvent.click(screen.getByText('Fetch'))

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Some error')
    })

    await userEvent.click(screen.getByText('Clear'))

    expect(screen.getByTestId('error').textContent).toBe('')
  })
})
