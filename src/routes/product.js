const { createProduct, getProduct, updateProduct, deleteProduct, listProducts } = require('../controllers/productController')
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
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })

router.post('/create', requireSignin, adminMiddleware, upload.array('productPicture'), createProduct)
router.get('/', requireSignin, adminMiddleware, listProducts)
router.get('/:id', requireSignin, adminMiddleware, getProduct)
router.patch('/:id', requireSignin, adminMiddleware, updateProduct)
router.delete('/:id', requireSignin, adminMiddleware, deleteProduct)

module.exports = router
