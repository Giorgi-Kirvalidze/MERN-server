const Product = require('../models/Product')
const slugify = require('slugify')

exports.createProduct = async (req, res) => {
    let productPictures = []
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        })
    }

    const product = new Product({
        ...req.body,
        slug: slugify(req.body.name),
        createdBy: req.user.id
    })
    try {
        const newProduct = await product.save()
        return res.status(201).json(newProduct)
    } catch (e) {
        return res.status(400).json(e)
    }
}

