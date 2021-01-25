const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')




const generateJwtToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

exports.signup = async (req, res) => {
    const inputs = Object.keys(req.body)
    const allowedInputs = [
        'firstName',
        'lastName',
        'email',
        'password',
        'number'
    ]
    const isValidOperation = inputs.every(input => allowedInputs.includes(input))
    if (!isValidOperation) return res.status(400).json({ message: 'Not valid operation.' })
    const isRegistered = await User.findOne({ email: req.body.email })
    if (isRegistered) return res.status(400).json({ message: 'User with this email is already registered.' })
    req.body.password = await bcrypt.hashSync(req.body.password, 8)

    const user = new User(req.body)
    try {
        await user.save()
        const token = generateJwtToken(user._id, user.role);
        res.status(201).json({ message: 'User registered successfully.', token: token })

    } catch (e) {
        return res.status(400).json({ message: e })
    }
}

exports.signin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) { return res.status(400).json({ message: 'მოხმარებლის სახელი ან პაროლი არასწორია' }) }
    if (user) {
        const isMatch = await user.authenticate(req.body.password)
        if (isMatch) {
            const token = generateJwtToken(user._id, user.role);
            res.status(200).json({
                token, user
            })
        } else {
            return res.status(400).json({ message: 'მოხმარებლის სახელი ან პაროლი არასწორია' })
        }
    }
}

exports.signout = async (req, res) => {
    try {
        req.logOut();
        res.status(200).json({ message: 'Signout successfully' })
        res.redirect('/');
    } catch (e) {
        return res.send({ message: e })
    }

}


// Requires Admin middleware

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

    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'lastName', 'password', 'email', 'role', 'contactNumber', 'profilePicture']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) { return res.status(400).send({ error: 'Invalid updates.' }) }
    try {
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

exports.listUsers = async (req, res) => {
    let limit = req.query.limit & req.query.limit <= 100 ? parseInt(req.query.limit) : 10
    let page = 0
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page)
            page = Number.isInteger(req.query.page) ? req.query.page : 0
        }
    }
    try {
        let result = await User.find().limit(limit).skip(page * limit)
        res.status(200).send(result)
    } catch (e) {
        return res.status(500).send(e)
    }
}