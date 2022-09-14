const mongoose = require('mongoose')
const Numbers = require('twilio/lib/rest/Numbers')
const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    products: {
        type:Array
    },
    address: {
        type:Object
    },
    amount: {
        type: Numbers,
        
    },
    status: {
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