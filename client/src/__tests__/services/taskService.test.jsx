import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockGet, mockPost, mockPut, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
}))

vi.mock('../../services/authService', () => ({
  default: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
  },
}))

import { taskService } from '../../services/taskService'

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call getTasks', async () => {
    await taskService.getTasks()

    expect(mockGet).toHaveBeenCalledWith('/api/tasks')
  })

  it('should call getTask with id', async () => {
    await taskService.getTask(5)

    expect(mockGet).toHaveBeenCalledWith('/api/tasks/5')
  })

  it('should call createTask', async () => {
    const taskData = { title: 'Test Task' }

    await taskService.createTask(taskData)

    expect(mockPost).toHaveBeenCalledWith('/api/tasks', taskData)
  })

  it('should call updateTask', async () => {
    const taskData = { title: 'Updated Task' }

    await taskService.updateTask(3, taskData)

    expect(mockPut).toHaveBeenCalledWith('/api/tasks/3', taskData)
  })

  it('should call deleteTask', async () => {
    await taskService.deleteTask(10)

    expect(mockDelete).toHaveBeenCalledWith('/api/tasks/10')
  })
})
