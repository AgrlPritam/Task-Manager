const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'   //To access name and other user data who created the task(populate command used). Care should be taken that the ref has same name as model name- 'User' here.check user.js in models
    }
},{
    timestamps:true
})
const Task = mongoose.model('Task', taskSchema) 

module.exports = Task