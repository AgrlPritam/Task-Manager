const request = require('supertest')
const app = require('../src/app')

test('SignUp a new User', async () => {
    await request(app).post('/users').send({
        name: 'Test',
        email: 'test@test.com',
        password: 'MyPass777!'
    }).expect(201)
})