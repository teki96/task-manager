const { test, beforeEach, describe, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Task = require('../models/task')
const User = require('../models/user')

describe('Task API', () => {
  let token
  let taskId

  beforeEach(async () => {
    await Task.deleteMany({})
    await User.deleteMany({
      $and: [
        { username: { $ne: 'logintestuser' } },
        { username: { $not: /^testuser_/ } },
      ],
    })

    const newUser = {
      username: `testuser_${Date.now()}`,
      name: 'Test User',
      password: 'password123',
    }

    const userResponse = await api.post('/api/users').send(newUser).expect(201)
    assert(userResponse.body.id, 'User creation failed')

    const login = await api
      .post('/api/login')
      .send({
        username: newUser.username,
        password: 'password123',
      })
      .expect(200)

    assert(login.body.token, 'Login failed - no token')
    token = login.body.token
  })

  describe('creating tasks', () => {
    test('succeeds with valid data', async () => {
      const newTask = { title: 'Test Task' }

      const response = await api
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(newTask)
        .expect(201)

      assert.strictEqual(response.body.title, 'Test Task')

      const tasks = await helper.tasksInDb()
      assert.strictEqual(tasks.length, 1)
    })

    test('fails if title is missing', async () => {
      await api
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400)
    })

    test('fails without token', async () => {
      await api.post('/api/tasks').send({ title: 'No Auth' }).expect(401)
    })
  })

  describe('viewing tasks', () => {
    test('returns only tasks for logged-in user', async () => {
      await api
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'User 1 Task' })

      const user2 = {
        username: 'user2',
        name: 'User 2',
        password: 'password123',
      }

      await api.post('/api/users').send(user2)

      const login2 = await api.post('/api/login').send(user2)

      await api
        .post('/api/tasks')
        .set('Authorization', `Bearer ${login2.body.token}`)
        .send({ title: 'User 2 Task' })

      const response = await api
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      assert.strictEqual(response.body.length, 1)
      assert.strictEqual(response.body[0].title, 'User 1 Task')
    })
  })

  describe('single task', () => {
    beforeEach(async () => {
      const response = await api
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to Retrieve' })

      taskId = response.body.id
    })

    test('returns task with valid id', async () => {
      const response = await api
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      assert.strictEqual(response.body.id, taskId)
    })

    test('returns 404 for non-existing task', async () => {
      const id = new mongoose.Types.ObjectId()
      await api
        .get(`/api/tasks/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })
  })

  describe('updating tasks', () => {
    beforeEach(async () => {
      const response = await api
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Original Task' })

      taskId = response.body.id
    })

    test('succeeds with valid data', async () => {
      const response = await api
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Task' })
        .expect(200)

      assert.strictEqual(response.body.title, 'Updated Task')
    })

    test('fails with empty title', async () => {
      await api
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '   ' })
        .expect(400)
    })
  })

  describe('deleting tasks', () => {
    beforeEach(async () => {
      const response = await api
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to Delete' })

      taskId = response.body.id
    })

    test('succeeds with valid id', async () => {
      await api
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const tasks = await helper.tasksInDb()
      assert.strictEqual(tasks.length, 0)
    })

    test('returns 404 for non-existing task', async () => {
      const id = new mongoose.Types.ObjectId()
      await api
        .delete(`/api/tasks/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })
  })
})

after(async () => {
  //delete users from db
  await User.deleteMany({
    $and: [
      { username: { $ne: 'logintestuser' } },
      { username: { $not: /^testuser_/ } },
    ],
  })
  await Task.deleteMany({})
  await mongoose.connection.close()
})
