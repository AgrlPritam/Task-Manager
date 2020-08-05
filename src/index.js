require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

//***********Test***************//
const Task = require('./models/task')
const User = require('./models/user')
const main = async () => {
    //Using task to find User
    // const task = await Task.findById('5f2abcb78462f231948fdd09')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    //Using user to find tasks
    const user = await User.findById('5f2abae4ed405d10102068b6')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main()