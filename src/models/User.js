const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 8
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 15
    },
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password could not contain word password')
            }
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    number: {
        type: String,
        required: true,
        validate(value) {
            if (value.trim().length > 9) {
                throw new Error('Provide correct Number')
            }
        }
    },
    profilePicture: { type: String }

}, { timestamps: true })


userSchema.methods.authenticate = async function (password) {
    const user = this
    return await bcrypt.compare(password, user.password)
}

// userSchema.pre('save', async function (next) {
//     const user = this
//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }
//     next()
// })

module.exports = mongoose.model('User', userSchema)