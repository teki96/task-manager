const tasksRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

// Get all tasks for the logged-in user
tasksRouter.get(
  '/',
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    try {
      if (!request.user) {
        return response.status(401).json({ error: 'User not found' })
      }

      const tasks = await Task.find({ userId: request.user.id }).sort({
        createdAt: -1,
      })
      response.json(tasks)
    } catch (error) {
      next(error)
    }
  },
)

// Get a single task by ID
tasksRouter.get(
  '/:id',
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    try {
      if (!request.user) {
        return response.status(401).json({ error: 'User not found' })
      }

      const task = await Task.findById(request.params.id)

      if (!task) {
        return response.status(404).json({ error: 'Task not found' })
      }

      // Verify that the task belongs to the logged-in user
      if (task.userId.toString() !== request.user.id.toString()) {
        return response
          .status(403)
          .json({ error: 'Unauthorized access to this task' })
      }

      response.json(task)
    } catch (error) {
      next(error)
    }
  },
)

// Create a new task
tasksRouter.post(
  '/',
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    try {
      if (!request.user) {
        return response.status(401).json({ error: 'User not found' })
      }

      const { title, description, status, priority, deadline } = request.body

      if (!title || title.trim() === '') {
        return response.status(400).json({ error: 'Title is required' })
      }

      const task = new Task({
        title,
        description: description || '',
        status: status || 'todo',
        priority: priority || 'medium',
        deadline: deadline || null,
        userId: request.user.id,
      })

      const savedTask = await task.save()
      response.status(201).json(savedTask)
    } catch (error) {
      if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
      next(error)
    }
  },
)

// Update a task
tasksRouter.put(
  '/:id',
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    try {
      if (!request.user) {
        return response.status(401).json({ error: 'User not found' })
      }

      const task = await Task.findById(request.params.id)

      if (!task) {
        return response.status(404).json({ error: 'Task not found' })
      }

      // Verify that the task belongs to the logged-in user
      if (task.userId.toString() !== request.user.id.toString()) {
        return response
          .status(403)
          .json({ error: 'Unauthorized to update this task' })
      }

      const { title, description, status, priority, deadline } = request.body

      if (title !== undefined && title.trim() === '') {
        return response.status(400).json({ error: 'Title cannot be empty' })
      }

      if (title !== undefined) task.title = title
      if (description !== undefined) task.description = description
      if (status !== undefined) task.status = status
      if (priority !== undefined) task.priority = priority
      if (deadline !== undefined) task.deadline = deadline

      const updatedTask = await task.save()
      response.json(updatedTask)
    } catch (error) {
      if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
      next(error)
    }
  },
)

// Delete a task
tasksRouter.delete(
  '/:id',
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    try {
      if (!request.user) {
        return response.status(401).json({ error: 'User not found' })
      }

      const task = await Task.findById(request.params.id)

      if (!task) {
        return response.status(404).json({ error: 'Task not found' })
      }

      // Verify that the task belongs to the logged-in user
      if (task.userId.toString() !== request.user.id.toString()) {
        return response
          .status(403)
          .json({ error: 'Unauthorized to delete this task' })
      }

      await Task.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } catch (error) {
      next(error)
    }
  },
)

module.exports = tasksRouter
