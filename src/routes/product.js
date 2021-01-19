const { createProduct } = require('../controllers/productController')
const express = require('express')
const { requireSignin, adminMiddleware } = require('../common-Middleware')
const path = require('path')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})
const upload = multer({ storage })



router.post('/product/create', requireSignin, adminMiddleware, upload.array('productPicture'), createProduct)

module.exports = router
