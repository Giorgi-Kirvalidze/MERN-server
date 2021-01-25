const express = require('express')
const { signup, signin, signout, getUser, updateUser, deleteUser, listUsers } = require('../controllers/userController')
const { adminMiddleware, requireSignin } = require('../common-Middleware/index')
const { validateSignupRequest, isRequestValidated } = require('../validators/index')
const router = express.Router()


router.post('/signup', validateSignupRequest, isRequestValidated, signup)
router.post('/signin', signin)
router.post('/signout', signout)
router.get('/:id', requireSignin, adminMiddleware, getUser)
router.patch('/:id', requireSignin, adminMiddleware, updateUser)
router.delete('/:id', requireSignin, adminMiddleware, deleteUser)
router.get('/', requireSignin, adminMiddleware, listUsers)



module.exports = router