let adminPartials = true;
let adminPartialsDont = true;
let submenuShowProduct = true;
const mongoose = require('mongoose');
const Category = require("../models/category");
const Brand = require("../models/brand");
const path = require("path");
const Product = require("../models/product");
const cloudinary = require("../utils/cloudinary");
const helpers = require("../services/poruductHelpers");
const ParentCategory = require("../models/parentCategory");
const ProductSize = require("../models/prodectSize");
const ProductConstants = require("../models/productConstants");

module.exports = {
  adminviewAllProducts: (req, res, nex) => {
    helpers.adminviewAllProducts().then((products) => {
      
      res.render("admin/products", {
        adminPartials,
        submenuShowProduct,
        admin: req.session.admin,
        products,
      });
    });
  },
  //reder add product page
  adminAddProducts: async (req, res, nex) => {
    let parent = await ParentCategory.find({ noSqlMode: { $ne: "3" } });
    let brand = await Brand.find();

    res.render("admin/addProducts", {
      adminPartials,
      submenuShowProduct,
      admin: req.session.admin,
      parent,
      brand,
    });
  },
  //api for disply sependent category
  dependentCategory: (request, response, next) => {
    var type = request.query.type;

    var search_query = request.query.parent_value;

    if (type === "load_state") {
      Category.find(
        { parentCategory: search_query, noSqlMode: { $ne: "3" } },
        { subCategory: 1 }
      ).then((data) => {
        response.json(data);
      });
    }
  },
  //product add into db
  addminAddProductIntoDB: (req, res) => {
    helpers.addminAddProductImagesIntoServer(req.files).then((imageArr) => {
      helpers.addminAddProductIntoDB(req.body, imageArr).then(() => {
        res.redirect("/admin/products");
      });
    });
  },
  adminProductUnlist: (req, res) => {
    let id = req.params.id;
    Product.updateOne({ _id: id }, { $set: { active: false } }).then(() =>
      res.redirect("/admin/products")
    );
  },
  adminProductList: async (req, res) => {
    let id = req.params.id;

    const data = {
      active: true,
    };

    await Product.findByIdAndUpdate(id, data, { new: true });
    res.redirect("/admin/products");
  },
  adminProductDelete: (req, res) => {
    let id = req.params.id;
    let image1_id = req.params.image1_id;
    let image2_id = req.params.image2_id;
    let image3_id = req.params.image3_id;
    helpers.adminProductDelete(id, image1_id, image2_id, image3_id).then(() => {
      res.redirect("/admin/products");
    });
  },
  adminEditProduct: async (req, res) => {
    let id = req.params.id;

    let product = await Product.findOne({ _id: id });
    let parent = await Category.distinct("parentCategory");
    let brand = await Brand.find();

    res.render("admin/editProduct", {
      adminPartials,
      submenuShowProduct,
      admin: req.session.admin,
      product,
      brand,
      parent,
    });
  },
  adminUpdateProduct: async (req, res) => {
    // imagestore to server
    await helpers.adminUpdateProductToserver(req.files, req.params.id);

    helpers.adminUpdateProductToDB(req.body, req.params.id).then(() => {
      res.redirect("/admin/products");
    });
  },
  displayAllProductsSize: async (req, res) => {
    let categories = await Category.find({ noSqlMode: { $ne: "3" } });
    let sizes = await ProductSize.aggregate(
      [
        {
          $group: {
            _id: { categoryId: "$categoryId", size: "$size", ob_id: "$_id" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.categoryId",
            ListOfName: {
              $push: {
                size: "$_id.size",
                id: "$_id.ob_id",
                Frequency: "$count",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "result",
          },
        },
      ],
      { allowDiskUse: true }
    );

    res.render("admin/productSizes", {
      adminPartials,
      submenuShowProduct,
      admin: req.session.admin,
      categories,
      sizes,
    });
  },
  adminAddProductSize: (req, res) => {
    helpers.adminAddProductSize(req.body).then(() => {
      res.redirect("/admin/add-products-size");
    });
  },
  adminDeleteProductsize: (req, res) => {
    let id = req.params.id;
    ProductSize.findByIdAndDelete(id).then(() => {
      res.redirect("/admin/delete-product-size");
    });
  },
  getAllSizeWithCatogory:async (req, res) => {
    try {
      let id = req.params.id;
      let sizes = await ProductSize.find({ categoryId: mongoose.Types.ObjectId(id), noSqlMode: { $ne: "3" } })
      res.status(200).json(sizes);
    } catch (error) {
      res.status(501)
    }
  },
  addSizeWithQuantity:async (req, res) => {
    try {
      let product_id= req.params.id
      let values = req.body
      let sizeType= typeof values.sizeId
      if (sizeType ==='string') {
        let qauntity = values.quantity
        let size_id = values.sizeId
        let ProductConstant = new ProductConstants({
          product_id,qauntity,size_id
        })
        await ProductConstant.save()
        res.redirect('/admin/products')
        
      }
      else {
        
      let len = values.sizeId.length;
      for (let i = 0; i < len; i++) { 
        let qauntity = values.quantity[i]
        let size_id = values.sizeId[i]
        console.log(size_id);
        
        let ProductConstant = new ProductConstants({
          product_id,qauntity,size_id
        })
        
        

        await ProductConstant.save()
      }
      
      res.redirect('/admin/products')
        
      }
     
    
      
    } catch (error) {
      console.log(error)
    }
  },
  viewAllSizesWithQuantity: async (req, res) => { 
    try {
      let proId = req.query.prodId;
      console.log(proId)
      let result = await ProductConstants.aggregate([
        {
          $match: {
          product_id:mongoose.Types.ObjectId(proId)
          }
        },
        {
          $lookup: {
            from: 'productsizes',
            localField: 'size_id',
            foreignField: '_id',
            as:"size"
          }
        }, {
          $unwind: {
            path:'$size'
          }
        },
        {
          $project: {
            qauntity: 1,
            'size.size':1
          }
        }
      ])
      res.render('admin/viewProductQuantity', {
        result,
        admin: req.session.admin,
        adminPartials :true,
        
      })
    } catch (error) {
      console.log(error)
    }
  },
  updateProductQuantity: async(req, res) => {
    let constantId = req.params.id;
    let { qauntity } = req.body;
  
    let result = await ProductConstants.updateOne({ _id: constantId }, { $set: { qauntity: qauntity } })
    if (result.modifiedCount === 1) {
      res.redirect('/products')
    }
    
  }
};
