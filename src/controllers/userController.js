const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.signup = async (req, res) => {
    const isRegistered = await User.findOne({ email: req.body.email })
    if (isRegistered) return res.status(400).json({ message: 'User with this email is already registered.' })
    req.body.password = await bcrypt.hashSync(req.body.password, 8)
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(201).json({ message: 'User registered  successfully' })
    } catch (e) {
        return res.status(400).json({ message: e })
    }
}

exports.signin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) { return res.status(400).json({ message: 'Please provide correct email.' }) }
    if (user.authenticate(req.body.password)) {
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7 days' })
        try {
            await user.save()
            res.status(200).json({
                token, user
            })
        } catch (e) {
            return res.status(400).json({ message: e })
        }
    } else {
        return res.status(400).json({ message: 'Invalid password.' })
    }
}


// Requires Admin middleware
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        return res.send(users)
    } catch (e) {
        return res.status(500).send(e)
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) { return res.status(404).json({ message: 'There is no user associated with that id' }) }
        res.send({ user })
    } catch (e) {
        res.status(500).json(e)
    }
}

exports.updateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const user = await User.findById(req.params.id)
        if (!user) { return res.status(404).send({}) }
        updates.forEach(update => user[update] = req.body[update])
        const updatedUser = await user.save()
        return res.send(updatedUser)
    } catch (e) {
        res.status(400).send(e)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) { return res.status(404).send({ message: 'There is no user associated with that id' }) }
        res.status(204).send({ message: 'User deleted  successfully' })
    } catch (e) {
        res.status(500).send(e)
    }
}

