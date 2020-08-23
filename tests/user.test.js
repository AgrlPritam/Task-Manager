const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const { response } = require('express')

const userOneId = new mongoose.Types.ObjectId()


const userOne = {
    _id:userOneId,
    name:'Mike',
    email:'mike@example.com',
    password:'56what!!67',
    tokens: [{
        token: jwt.sign({ _id:userOneId}, process.env.JWT_TOKEN)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()

})

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