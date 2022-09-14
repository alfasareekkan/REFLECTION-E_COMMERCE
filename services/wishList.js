const User = require('../models/user')
const mongoose=require('mongoose')


module.exports = {
    addToWisList:async (userId, productId) => {
        let data = {
            productId: mongoose.Types.ObjectId(productId)
        }
        let userWisList = await User.findOne({ _id: userId })
        let index=userWisList.wishList.findIndex( (value)=> value.productId==productId)
        if (index === -1) {
            userWisList.wishList.push(data)
        userWisList = await userWisList.save()
        return userWisList
        }
        else {
    
        userWisList.wishList.splice(index, 1)
         return userWisList = await userWisList.save()
  
        }
        
        
    }, 
    getUserWishList: async (userId) => {
        console.log(userId)
        let wishLists =await User.aggregate([
            {
                $match: { 
                    _id:mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "wishList.productId",
                    foreignField: "_id",
                    as:"products"
                }
            },
            {
                $project: {
                    products:1
                }
            },
            {
                $unwind: {
                    path:"$products"
                }
            },
            {
                $project: {
                    "products._id": 1,
                    "products.category": 1,
                    "products.title": 1,
                    "products.price": 1,
                    "products.image": 1,
                    
                }
            },
            {
                $lookup: {
                    from: "productconstants",
                    localField: "products._id",
                    foreignField: "product_id",
                    as:"productConstants"
                    
                }
            },
            {
                $lookup: {
                    from: "productsizes",
                    localField: "products.category",
                    foreignField: "categoryId",
                    as:"sizes"
                }
            }

        ])
        console.log(wishLists);
        return wishLists
    }
}