const wishList = require('../services/wishList')
const cartServices = require('../services/cartServices')
const productConstants = require('../models/productConstants')
const Cart = require('../models/cart')
const mongoose = require('mongoose')
const User=require('../models/user')


module.exports = {
    getUserWishList: async (req, res, next) => {
        let userWisLists = await wishList.getUserWishList(req.session.user._id)
        let cartCount = await cartServices.cartCountHelper(req.session.user._id)
        res.render('user/shopping/wishList', { userWisLists, userDetails: req.session.user, cartCount,wishListCount:userWisLists.length })
    },
    addToWisList: async (req, res) => {
        try {
            req.session.referer = req.headers.referer
            let productId = req.params.id
            let userId = req.session.user._id
            let result = await wishList.addToWisList(userId, productId)
            if (result) {
                res.redirect(req.session.referer)
            }
        } catch (error) {
            res.send(401)
            console.log(error);
        }
        
    },
    addToCart: async (req, res) => {
        let sizeId = req.body.sizeId
        let productId = req.params.id
        let userId = req.session.user._id
        let productConstant = await productConstants.findOne({ product_id: productId, size_id: sizeId })
    
        
        try {
            let userCartValidate = await Cart.findOne({ user_id:mongoose.Types.ObjectId(userId) })
            
            if (userCartValidate) {
                let alreadyExistProductInCart = await Cart.findOne({ user_id: mongoose.Types.ObjectId(userId), products: { $elemMatch: { product_id: mongoose.Types.ObjectId(productId), productConstantId: mongoose.Types.ObjectId(productConstant._id) } } })
                if (alreadyExistProductInCart) {
                    let result = await Cart.findOneAndUpdate({ user_id: mongoose.Types.ObjectId(userId), products: { $elemMatch: { product_id: mongoose.Types.ObjectId(productId), productConstantId: mongoose.Types.ObjectId(productConstant._id) } } }, { $inc: { "products.$.count": 1 } }, { new: true })
                    if (result) {
                    
                    }
                    res.redirect('/v1/user-cart-show')
                }
                else {
                    let newProduct = { product_id: mongoose.Types.ObjectId(productId), productConstantId: mongoose.Types.ObjectId(productConstant._id), count: 1 }
                    userCartValidate.products.push(newProduct)
                    await userCartValidate.save()
                        
                    res.redirect('/v1/user-cart-show')
                }
            }
            else {
                let newCart = await cartServices.createCart(userId, productId, productConstant._id)
                console.log(newCart);
                res.redirect('/v1/user-cart-show')
            }
                
        }
            
        catch (error) {
            console.log(error);
            res.send(404)
        }

        
    },
    removeFromWisList:async (req, res) => {
        try {
            let userId = req.body.userId
            let productId = req.body.productId  
            let result = await User.updateOne({ _id: mongoose.Types.ObjectId(userId) }, { $pull: { "wishList": {"productId": mongoose.Types.ObjectId(productId) } } })
            if (result.acknowledged) {
                res.status(200).json({removeProduct:true})
            }

            
        } catch (error) {
            console.log(error);
        }
    }

}