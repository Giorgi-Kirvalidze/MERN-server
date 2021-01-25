const { Router } = require('express')
const express = require('express')
const path = require('path')
const multer = require('multer')
const { requireSignin, adminMiddleware } = require('../common-Middleware')
const { addCategory, updateCategory, deleteCategory, listCategories } = require('../controllers/categoryController')
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

router.post('/', requireSignin, adminMiddleware, upload.single('categoryImage'), addCategory)
router.get('/', requireSignin, listCategories)
router.patch('/:id', requireSignin, adminMiddleware, updateCategory)
router.delete('/:id', requireSignin, adminMiddleware, deleteCategory)

module.exports = router