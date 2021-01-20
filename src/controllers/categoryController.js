const Category = require('../models/Category')
const Product = require('../models/Product')
const slugify = require('slugify')

function createCategories(categories, parentId = null) {
    const categoryList = []
    let category
    if (parentId == null) {
        category = categories.filter(category => category.parentId == undefined)
    } else {
        category = categories.filter(category => category.parentId == parentId)
    }
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            parentId: cate.parentId,
            slug: cate.slug,
            children: createCategories(categories, cate._id)
        })
    }
    return categoryList
}

exports.addCategory = async (req, res) => {
    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name),
        createdBy: req.user._id,
    }
    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId
    }
    if (req.file) {
        categoryObj.categoryImage = `${process.env.API}/public/${req.file.filename}`
    } try {
        const category = new Category(categoryObj)
        const newCategory = await category.save()
        return res.status(201).json({ newCategory })
    } catch (e) {
        return res.status(400).send(e)
    }
}

exports.listCategories = async (req, res) => {
    const categories = await Category.find()
    if (categories) {
        const categoryList = createCategories(categories)
        return res.status(200).json({ categoryList })
    }
}

exports.updateCategory = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['_id', 'name', 'parnetId', 'categoryImage', 'slug']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) { return res.status(400).send({ error: 'Invalid updates.' }) }
    try {
        const category = await Category.findById(req.params.id)
        updates.forEach(update => category[update] = req.body[update])
        const updatedCategory = await category.save()
        return res.status(204).json({ updatedCategory })
    } catch (e) {
        return res.status(400).send(e)
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndRemove(req.params.id)
        await Category.deleteMany({ parentId: req.params.id })
        await Product.deleteMany({ category: req.params.id })
        return res.status(204).json({ message: 'Category deleted successfully' })
    }
    catch (e) {
        return res.status(400).send(e)
    }
}
