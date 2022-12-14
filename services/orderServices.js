const Order = require('../models/order')
const mongoose=require('mongoose')
module.exports = {
    createNewOrder: async (userId, userCart, totalPrice, addresses) => {
        try {
            let result
            let newOrder = new Order({
                user_id: mongoose.Types.ObjectId(userId),
                products: userCart,
                deliveryAddress: addresses[0].addresses,
                totalPrice: totalPrice[0].totalPrice,
                subTotal: totalPrice[0].subTotal,
                offerPrice: totalPrice[0].couponPrice,
                paymentType: "Pending",
                orderStatus:"Pending" 
            })
            return  result = await newOrder.save()

        } catch (error) {
            return null
        }
        
    

    },
    updateOrder: async (orderId,paymentMethod,orderStatus,paymentStatus) => {
        try {
            let result;
            let order = await Order.findById(mongoose.Types.ObjectId(orderId));
            let product = order.products;
            order.products = product.map(v => { return { ...v, paymentStatus:paymentStatus,orderStatus:[{ status:orderStatus,date:Date.now() }]  } });
            // let data = {
            order.paymentType= paymentMethod
            order.paymentStatus=paymentStatus
            order.orderStatus = orderStatus
            order=await order.save();

          return order
            
        } catch (error) {
            return null
            
        }
    }
}
