const app = require('./app')

const port = process.env.PORT
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// const multer = require('multer')

// Handling File Upload using Multer
// const upload = multer({
//     dest:'images',
//     limits:{
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {        //refer regex101.com for testing regular expressions
//             return cb(new Error('Please upload a Word Document'))
//         }

//         cb(undefined, true)
        // cb(new Error('File must be a PDF'))  //Error message sent back
        // cb(undefined, true)                  //Accept the upload
        // cb(undefined, false)                 //Silently reject the upload
//     }
// })

// app.post('/upload',upload.single('upload'), (req,res) => {
//     res.send()
// },(error, req, res, next) => {
//     res.status(400).send({ error:error.message })
// })

/***************************************************************/
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


//***********Test***************//
// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
    //Using task to find User
    // const task = await Task.findById('5f2abcb78462f231948fdd09')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    //Using user to find tasks
//     const user = await User.findById('5f2abae4ed405d10102068b6')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()