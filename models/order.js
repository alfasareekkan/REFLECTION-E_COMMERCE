const mongoose = require('mongoose')
const Numbers = require('twilio/lib/rest/Numbers')
const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    products: {
        type: Array
    },
    deliveryAddress: {
        type: Object
    },
    totalAmount: {
        type: Numbers,
        
    },
    coupon: {
        code: String,
        discount: Number
    },
    subTotal: {
        type: Number
    },
    paymentType:{
        type:String
    },
    paymentStatus: {
        type: Boolean,
    },
    orderStatus: {
        type: String,
        enum: [
            "pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Returned",
            "Return-Confirmed"
        ]
    },


    
},{ timestamps:true,collection:"order"})