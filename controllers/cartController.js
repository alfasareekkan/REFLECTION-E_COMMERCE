const Cart=require('../models/cart')
const cartServices = require('../services/cartServices')
const mongoose=require('mongoose')
module.exports = {
    addProductToCart:async (req, res) => {
    
        try {
            if (req.session.user) {
                let user_id = req.session.user._id
                let productId = req.params.id || req.session.productToCart 
                let productConstantId = req.params.productConstants || req.session.productConstants 
                let userCartValidate = await Cart.findOne({ user_id:mongoose.Types.ObjectId(user_id) })
                // console.log(userCartValidate)
                if (userCartValidate) {
                    let alreadyExistProductInCart = await Cart.findOne({ user_id:mongoose.Types.ObjectId(user_id), products:{ $elemMatch :{ product_id: mongoose.Types.ObjectId(productId), productConstantId:mongoose.Types.ObjectId(productConstantId) } }})
                    if (alreadyExistProductInCart) {
                         let result = await Cart.findOneAndUpdate({ user_id:mongoose.Types.ObjectId(user_id), products: { $elemMatch: { product_id: mongoose.Types.ObjectId(productId), productConstantId: mongoose.Types.ObjectId(productConstantId) } } }, { $inc: { "products.$.count": 1 } }, { new: true })
                        res.status(201).json({condition:false,length:result.product.length})
                    }
                    else {
                        let newProduct = { product_id: mongoose.Types.ObjectId(productId), productConstantId: mongoose.Types.ObjectId(productConstantId),count:1 }
                        userCartValidate.products.push(newProduct)
                        await userCartValidate.save()
                        // console.log(userCartValidate.products.length)
                        
                        res.status(201).json({condition:false,length:userCartValidate.products.length})
                    }
                }
                else {
                    let newCart = await cartServices.createCart(user_id, productId, productConstantId)
                    res.status(201).json({condition:false,length:newCart.products.length})
                }
                
            }
            else {
                req.session.productToCart = req.params.id
                req.session.productConstants=req.params.productConstants
                // res.redirect('/')
               res.status(200).json({condition:true})
            }
        } catch (error) {
            console.log(error);
            res.send(404)
        }
        
    },
    displayCart: async (req, res) => {
        let userDetails = req.session.user
        let userCart = await cartServices.userCart(userDetails._id)
        let cartCount = await cartServices.cartCountHelper(userDetails._id)
        let totalPrice = await cartServices.totalPriceHelper(userDetails._id)
        let cartCheck
        // cartCount===0 ?cartCount=true:
        console.log(cartCount, "😢😢😢😢😢😢😢")
        if (cartCount === 0||cartCount ===undefined) { 
            cartCheck = true
        } else {
            cartCheck = false
        }
        res.render('user/shopping/cart',
            { userDetails,userCart,cartCount,totalPrice,cartCheck }
        )
    },
    incrementOrDecrementCartItemCount: async (req, res) => {
        try {
            if (req.params.id) {
                let result = await cartServices.dropProductsFromCart(req.body)
                if (result) {
                    res.status(200).json({removeProduct:true})
                }
            }
            else {
                let result= await cartServices.incrementOrDecrementCartItemCount(req.body)
                if (result) {
                    let totalPriceOfEachProduct = await cartServices.productPriceOfEachProductForCart(req.body.cartId, req.body.productConstantId)
                    let subTotal=await cartServices.totalPriceHelper(req.session.user._id)
                    res.status(200).json({ totalPriceOfEachProduct:totalPriceOfEachProduct[0].eachTotal,subTotal: subTotal[0].subTotal })
            } 
            }
      
        } catch (error) {
            res.send(401)
        }
    },
    deleteProductFromCart: async (req, res) => { 
        let result = await cartServices.dropProductsFromCart(req.body)
        if (result) res.status(200).json({removeProduct:true,length:result.products.length})
    }


}