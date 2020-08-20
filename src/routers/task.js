const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks',auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Get /tasks?completed=true
//Pagination --> Get /tasks?limit=2&skip=2  This sets the limit of two result and skip first 2 result for the page. So it fetches third and fourth task from db
//similarly limit=3&skip=3 will fetch fourth,fifth,sixth tasks from db
//Sorting --> Get /tasks?sortBy=createdAt:asc for ascending or createdAt:desc for descending
router.get('/tasks',auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'        //The endpoint true in url is string type but we want to store boolean true

    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1   //sort[parts[0]] picks the first half of endpoint, createdAt here (can be completed or other params from schema) and parts[1] has second half whether asc or desc
    }
    try {
        //const tasks = await Task.find({})
        //const tasks = await Task.find({ owner:req.user._id })  //alternative way is using populate (below)
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: +req.query.limit,
                skip: +req.query.skip,
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id,owner:req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id:req.params.id, owner:req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id:req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router