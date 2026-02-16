import api from './authService'

export const taskService = {
  // Get all tasks for logged-in user
  getTasks: () => {
    return api.get('/api/tasks')
  },

  // Get single task by ID
  getTask: (id) => {
    return api.get(`/api/tasks/${id}`)
  },

  // Create new task
  createTask: (taskData) => {
    return api.post('/api/tasks', taskData)
  },

  // Update task
  updateTask: (id, taskData) => {
    return api.put(`/api/tasks/${id}`, taskData)
  },

  // Delete task
  deleteTask: (id) => {
    return api.delete(`/api/tasks/${id}`)
  },
}

export default taskService
