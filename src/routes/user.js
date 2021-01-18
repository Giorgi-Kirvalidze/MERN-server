const express = require('express')
const { signup, signin, getUser, updateUser, deleteUser, getUsers } = require('../controllers/userController')
const { adminMiddleware, requireSignin } = require('../common-Middleware/index')
const router = express.Router()


router.post('/signup', signup)
router.post('/signin', signin)
router.get('/users', requireSignin, adminMiddleware, getUsers)
router.get('/users/:id', requireSignin, adminMiddleware, getUser)
router.patch('/users/:id', requireSignin, adminMiddleware, updateUser)
router.delete('/users/:id', requireSignin, adminMiddleware, deleteUser)



module.exports = router