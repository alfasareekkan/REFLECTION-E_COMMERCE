// const { userCart } = require('../services/cartServices')
const cartServices = require('../services/cartServices')
const orderServices = require('../services/orderServices')
const userServices = require('../services/userServices')
const Cart = require('../models/cart')
const Order=require('../models/order')


module.exports = {
    checkoutPage: async (req, res) => { 
        try {
            let userDetails=req.session.user
        let userCart = await cartServices.userCart(userDetails._id)
        let cartCount = await cartServices.cartCountHelper(userDetails._id)
            let totalPrice = await cartServices.totalPriceHelper(userDetails._id)
            let addresses = await userServices.findUser(userDetails._id)
            // console.log(addresses.addresses)

        res.render('user/shopping/checkout',{userCart,cartCount,totalPrice,userDetails,addresses:addresses.addresses})
        } catch (error) {
            res.redirect("/404error")
            
        }
        
    },
    addAddress: async (req, res) => {
        try {
            let addresses = req.body
            let userId = req.session.user._id
            // let address
            let result;
            if (req.params.id) {
               result = await userServices.updateUserAddress(addresses, userId,req.params.id)
                
            }else{
             result = await userServices.addUserAddress(addresses, userId)

            }
            if (result) {
                res.redirect('/v1/checkout')
            }

        } catch (error) {

            res.redirect("/404error")
        }
        
        
        
        

    },
    checkOutOrder: async(req, res) => {
        try {
            // console.log(req.body)
            let orderDetails=req.body, userId = req.session.user._id,
             userCart = await cartServices.userCart(userId),
            //  cartCount = await cartServices.cartCountHelper(userId),
             totalPrice = await cartServices.totalPriceHelper(userId),
            addresses = await userServices.findUserAddress(userId, orderDetails.address)
            order = await orderServices.createNewOrder(userId, userCart, totalPrice, addresses)
            if (order) {
                if (orderDetails.payment === 'COD') {
                    let updateOrder = await orderServices.updateOrder(order._id, orderDetails.payment, "Confirmed", false)
                    await Cart.findByIdAndDelete(userCart[0]._id)
                    res.status(200).json({ orderId:updateOrder._id ,paymentMethod:"COD"})
                }
            }

        } catch (error) {
            
            res.redirect("/404error")
            
        }
    },
    invoice: async(req, res) => {
        let orderId = req.params.id
        console.log(typeof orderId)
        let userDetails = req.session.user
        try {
            if (orderId.length === 24) {
                let userOrder = await Order.findById(orderId,{products:1,deliveryAddress:1,subTotal:1,paymentType:1,orderStatus:1,updatedAt:1})
                console.log(userOrder.products)
                console.log(userOrder)
               res.render("user/shopping/invoice", {userDetails,userOrder}) 
            }
            else { 
                throw new Error
            }

        } catch (error) {
            res.redirect("/404error")
        }
    }

}