const mongoose = require('mongoose');
let productConstants = new mongoose.Schema({
    product_id: {
        type:mongoose.Schema.Types.ObjectId
    },
    size_id: {
        type:mongoose.Schema.Types.ObjectId
    },
    qauntity: {
        type:Number
    }
},{timestamps:true},{collection:'ProductConstants'})

module.exports=mongoose.model('ProductConstants',productConstants)