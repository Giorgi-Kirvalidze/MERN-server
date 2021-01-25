const express = require('express')
const { requireSignin } = require('../common-Middleware/index')
const { addItemToCart } = require('../controllers/cartController')
const router = express.Router()

router.post('/', requireSignin, addItemToCart)

module.exports = router