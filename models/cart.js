const mongoose = require('mongoose');

// const productSchema = mongoose.Schema({
//     product_id: {
//         type:mongoose.Schema.Types.ObjectId
//     },
//     count: {
//         type:Number
//     }
// })

const cartSchema = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId
    },
    products: Array,
    couponPrice: {
        type: Number,
        default:0
    }
    
}, {
    timestamps: true,collection:'Cart'
}
)

module.exports=mongoose.model('Cart',cartSchema)