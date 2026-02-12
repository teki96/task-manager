const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('Login API', () => {
  beforeEach(async () => {
    // Only delete login test users, not task test users
    await User.deleteMany({ username: 'logintestuser' })

    // Create a test user
    const passwordHash = bcrypt.hashSync('correctpassword', 10)
    const userDoc = new User({
      username: 'logintestuser',
      name: 'Login Test',
      passwordHash,
    })
    await userDoc.save()
  })

  test('login succeeds with valid credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'logintestuser',
        password: 'correctpassword',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(response.body.token)
    assert.strictEqual(response.body.username, 'logintestuser')
    assert.strictEqual(response.body.name, 'Login Test')
  })

  test('login fails with invalid username', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'nonexistent',
        password: 'correctpassword',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('login fails with incorrect password', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'logintestuser',
        password: 'wrongpassword',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('login fails with missing username', async () => {
    const response = await api
      .post('/api/login')
      .send({
        password: 'correctpassword',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('login fails with missing password', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'logintest',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
  })
})

after(async () => {
  await mongoose.connection.close()
})
