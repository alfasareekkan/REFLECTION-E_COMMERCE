const Order = require('../models/order')
const mongoose=require('mongoose')
module.exports = {
    createNewOrder: async (userId, userCart, totalPrice, addresses) => {
        try {
            let newOrder = new Order({
                user_id: mongoose.Types.ObjectId(userId),
                products: userCart,
                deliveryAddress: addresses[0].addresses,
                totalPrice: totalPrice[0].subTotal,
                subTotal: totalPrice[0].subTotal,
                paymentType: "Pending",
                orderStatus:"Pending"
            })
            return result = await newOrder.save()
        } catch (error) {
            return null
        }
        
    

    },
    updateOrder: async(orderId,paymentMethod,orderStatus,paymentStatus) => {
        try {
            let data = {
                paymentType: paymentMethod,
                paymentStatus,
                orderStatus 
            }
            return result = await Order.findByIdAndUpdate(orderId, data)
            
        } catch (error) {
            return null
        }
    }
}
