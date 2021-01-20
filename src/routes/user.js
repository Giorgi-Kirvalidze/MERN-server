const express = require('express')
const { signup, signin, getUser, updateUser, deleteUser, getUsers, listUsers } = require('../controllers/userController')
const { adminMiddleware, requireSignin } = require('../common-Middleware/index')
const router = express.Router()


router.post('/signup', signup)
router.post('/signin', signin)
router.get('/:id', requireSignin, adminMiddleware, getUser)
router.patch('/:id', requireSignin, adminMiddleware, updateUser)
router.delete('/:id', requireSignin, adminMiddleware, deleteUser)
router.get('/', requireSignin, adminMiddleware, listUsers)




module.exports = router