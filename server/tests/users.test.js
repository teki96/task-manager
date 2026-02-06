const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const User = require('../models/user')

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('creating a new user', () => {
    test('succeeds with a valid username and password', async () => {
      const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'password123',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.username, newUser.username)
      assert.strictEqual(response.body.name, newUser.name)
      assert(response.body.id)
      assert(!response.body.passwordHash)
      assert(!response.body._id)
    })

    test('fails with status 400 if username is too short', async () => {
      const newUser = {
        username: 'ab',
        name: 'Short User',
        password: 'password123',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result.body.error.includes(
          'username must be at least 3 characters long',
        ),
      )
    })

    test('fails with status 400 if password is too short', async () => {
      const newUser = {
        username: 'validuser',
        name: 'Valid User',
        password: 'ab',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result.body.error.includes(
          'password must be at least 3 characters long',
        ),
      )
    })

    test('fails with status 400 if username is missing', async () => {
      const newUser = {
        name: 'No Username',
        password: 'password123',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result.body.error.includes(
          'username must be at least 3 characters long',
        ),
      )
    })

    test('fails with status 400 if password is missing', async () => {
      const newUser = {
        username: 'nopwd',
        name: 'No Password',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result.body.error.includes(
          'password must be at least 3 characters long',
        ),
      )
    })
  })

  describe('viewing all users', () => {
    test('users are returned as json', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert(Array.isArray(response.body))
    })

    test('GET returns users created in this test', async () => {
      const newUser = {
        username: 'gettestuser',
        name: 'Get Test',
        password: 'password123',
      }

      await api.post('/api/users').send(newUser).expect(201)

      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert(Array.isArray(response.body))
      const usernames = response.body.map((u) => u.username)
      assert(
        usernames.includes(newUser.username),
        `User ${newUser.username} not found`,
      )
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
