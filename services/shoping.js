const Product = require("../models/product");
const ProductConstants = require("../models/productConstants");
const mongoose = require("mongoose");

module.exports = {
  getAllProduct: (parent) => {
    return new Promise(async (resolve, reject) => {
      console.log(parent);
      let products = await Product.aggregate([
        {
          $lookup: {
            from: "categories", 
            localField: "category",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "parentcategories",
            localField: "result.parentCategory",
            foreignField: "_id",
            as: "result2",
          },
        },
        {
          $match: {
            active: true,
            noSqlMode: { $ne: "3" },
            "result2.parentCategory": parent,
          },
        },
      ]);
      console.log(products);
      resolve(products);
    });
  }, 
  getProductCategoryWise: (categoryId) => {
    return new Promise(async (resolve, reject) => {
      let categoryProducts = await Product.find({
        category: categoryId,
        active: true,
      });
      resolve(categoryProducts);
    });
  },
  findSizeAndQuantityForProduct: async (prodId) => {
    try {
      console.log(prodId);
      let ppp = prodId.toString();
      let sizes = await ProductConstants.aggregate([
        {
          $match: {
            product_id: new mongoose.Types.ObjectId(prodId),
          },
        },
        {
          $lookup: {
            from: "productsizes",
            localField: "size_id",
            foreignField: "_id",
            as: "result",
          },
        },

        {
          $project: {
            product_id: 1,
            qauntity: 1,
            size: {
              $arrayElemAt: ["$result.size", 0],
            },
          },
        },
      ]);
      return sizes;
    } catch (error) {
      return false;
    }
    },
    getProductQuantityWithSize:async (id) => {
      try {
        
            let productQuantity = await ProductConstants.findById(id)
            return productQuantity
        } catch (error) {
            
        }
    }
};
