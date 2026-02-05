const { test, after } = require('node:test')
const assert = require('node:assert')
const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

test('GET /health should return 200 and status ok', async () => {
  const response = await request(app)
    .get('/health')
    .expect(200)
    .expect('Content-Type', /json/)

  assert.strictEqual(response.body.status, 'ok')
})

after(async () => {
  await mongoose.connection.close()
})
