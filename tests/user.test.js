const request = require('supertest')
const {userOne,userOneId,setupDatabase} = require('./fixtures/db')
const app = require('../src/app')
const User = require('../src/models/user')
const { response } = require('express')


beforeEach(setupDatabase)

// afterEach(() => {
//     console.log('aftereach');
// })

test('SignUp a new User', async () => {
    const response = await request(app).post('/users').send({
        name: 'Test',
        email: 'test@test.com',
        password: 'MyPass777!'
    }).expect(201)

    //Assert that the databse was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name:'Test',
            email:'test@test.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass777!')
})



test('Login Existing User', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisain\'t right'
    }).expect(400)
})

test('Should get profile of user',async() => {
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async ()=> {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Upload Avatar Image',async() => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))      //{} is not same as {}  so expect({}).toBe({}) will fail
})

test('Should Update Valid User Field', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'Jest'
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jest')
})

test('Should Not Update invalid User Fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        location:'Nepal'
    })
    .expect(400)
})