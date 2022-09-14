const hbs = require('express-handlebars')
const Handlebars = require('handlebars')
const Cart = require('../models/cart')
const mongoose = require('mongoose')



module.exports = {
    cartCountHelper:async (userId) => {
        let cartCount = await Cart.aggregate([
            {
                $match:{user_id:mongoose.Types.ObjectId(userId)}
            },
            {
                $project: {
                    
                    cartCount: {
                        $size:'$products'
                    }
                }
            }
        ])
        
        return cartCount[0].cartCount
        
    }
}