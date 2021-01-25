const Cart = require('../models/Cart')

exports.addItemToCart = async (req, res) => {
    const oldCart = await Cart.findOne({ user: req.user._id })
    if (!oldCart) {
        const cart = new Cart({
            user: req.user._id,
            cartItems: req.body.cartItems
        })
        const newCart = await cart.save()
        return res.status(201).json({ newCart })
    }
    if (oldCart) {
        const product = req.body.cartItems[0].product
        const item = oldCart.cartItems.find(c => c.product == product)
        if (item) {
            const updatedOldCart = await Cart.findOneAndUpdate({ user: req.user._id }, {
                $set: {
                    cartItems: { ...req.body.cartItems[0], quantity: item.quantity + req.body.cartItems[0].quantity }
                }
            })
            await updatedOldCart.save()
            return res.status(200).json({ updatedOldCart })
        } else {
            const updatedOldCart = await Cart.findOneAndUpdate({ user: req.body._id }, {
                $push: {
                    cartItems: req.body.cartItems
                }
            })
            await updatedOldCart.save()
            return res.status(200).json({ updatedOldCart })
        }
    }

}

