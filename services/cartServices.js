const { default: mongoose } = require("mongoose");
const Products = require("../models/product");
const Cart = require("../models/cart");
const { count } = require("../models/cart");

module.exports = {
  createCart: async (userId, productId, productConstantId) => {
    let cart = new Cart({
      user_id: userId,
      products: [
        {
          product_id: mongoose.Types.ObjectId(productId),
          productConstantId: mongoose.Types.ObjectId(productConstantId),
          count: 1,
        },
      ],
    });
    return await cart.save();
  },
  userCart: async (userId) => {
    try {
      let cart = await Cart.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(userId) } },
        {
          $unwind: {
            path: "$products",
          },
        },
        {
          $lookup: {
            from: "productconstants",
            localField: "products.productConstantId",
            foreignField: "_id",
            as: "result",
          },
        },
        
        {
          $unwind: {
            path: "$result",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "result.product_id",
            foreignField: "_id",
            as: "cartItems",
          },
        },
        {
          $unwind: { path: "$cartItems" },
        },
        {
          $lookup: {
            from: "productsizes",
            localField: "result.size_id",
            foreignField: "_id",
            as: "productSize",
          },
        },
        {
          $unwind: { path: "$productSize" },
        },
        {
          $project: {
            user_id: 1,
            products: 1,
            result: 1,
            cartItems: 1,
            productSize:1,
            
            eachTotal: {
              $multiply:['$products.count','$cartItems.price']
            },
          }
        }
      ]);
        // console.log(cart);
      return cart;
    } catch (error) {
      res.send(404);
    }
  },
    cartCountHelper: async (userId) => {
      try {
      console.log("💕💕💕💕💕")
      let cartCount = await Cart.aggregate([
        {
          $match: { user_id: mongoose.Types.ObjectId(userId) },
        },
        {
          $project: {
            cartCount: {
              $size: "$products",
            },
          },
        },
      ]);
      console.log(cartCount[0].cartCount)
      console.log(cartCount) 

      return cartCount[0].cartCount;
      } catch (error) {
        
    }
  },
  incrementOrDecrementCartItemCount: async ({
    cartId,
    productConstantId,
    count,
  }) => {
    let result = await Cart.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(cartId),
        products: {
          $elemMatch: {
            productConstantId: mongoose.Types.ObjectId(productConstantId),
          },
        },
      },
      { $set: { "products.$.count": count } },
      { new: true }
    );

    return result
  },
  dropProductsFromCart:async({cartId,
    productConstantId,
    count,
  }) => {
    let result = await Cart.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(cartId),
    },
      {
        $pull:{products:{productConstantId:mongoose.Types.ObjectId(productConstantId)}},
      }
    )
    
    return result
  },
  


  productPriceOfEachProductForCart: async (cartId, productConstantId) => {
    try {
      let prices = await Cart.aggregate([
        {
          $match: {
  
            _id: mongoose.Types.ObjectId(cartId),
            "products.productConstantId": mongoose.Types.ObjectId(productConstantId)
  
          },
        },
        {
          $unwind: {
            path:"$products"
          }
        },
  
        {
          $match: {
            "products.productConstantId": mongoose.Types.ObjectId(productConstantId)
  
          },
        },
  
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as:"productDetails"
          }
        },  
        {
          $unwind: {
            path:"$productDetails"
          }
        },
        {
          $project: {
            _id:0,
            eachTotal: {
              $multiply:['$products.count','$productDetails.price'] 
            }
          }
        }
  
        
      ])
      // console.log(prices)
      return prices
    } catch (error) {
      res.send(404)
    }
    
  },
  totalPriceHelper:async (userId) => {
    try {
      let totalPrices = await Cart.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(userId) } },
        {
          $unwind: {
            path: "$products",
          },
        },
        {
          $lookup: {
            from: "productconstants",
            localField: "products.productConstantId",
            foreignField: "_id",
            as: "result",
          },
        },
        
        {
          $unwind: {
            path: "$result",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "result.product_id",
            foreignField: "_id",
            as: "cartItems",
          },
        },
        {
          $unwind: { path: "$cartItems" },
        },
        {
          $project: {
            
            eachTotal: {
              $multiply:['$products.count','$cartItems.price']
            },
            
          }
        },
        {
          $group: {
            _id:null,
            subTotal: {
              $sum: "$eachTotal"}
          }
        }

      ])
      // console.log(totalPrices, "dfhhnfgjnhfhfj");
      return totalPrices;
    } catch (error) {
      console.log(error);
    }
  }
};
