const mongoose = require('mongoose');
const Category = require('../models/category')
const ShoppingServices = require('../services/shoping')
const Product = require('../models/product')
const cartServices=require('../services/cartServices')

const Cart =require('../models/cart');
module.exports = {
    shopingCategoryMen: async (req, res, next) => {
        let category = await Category.aggregate([{ $lookup:{from:"parentcategories",localField:"parentCategory",foreignField:"_id",as:"result"}},{$match:{"result.parentCategory":"Men",noSqlMode:{ $ne: "3" },status:true}},{$project:{subCategory:1}}])
        // console.log(category);
        // console.log(req.params.id);
        if (req.params.id==='101men') {
            ShoppingServices.getAllProduct('Men').then(async(products) => {
                let userDetails = req.session.user
                let cartCount
                if(userDetails) cartCount= await cartServices.cartCountHelper(userDetails._id)
                res.render('user/shopping/category', {
                    products,men:true,category,userDetails,cartCount
                })
            })
        }
        else {
            ShoppingServices.getProductCategoryWise(req.params.id).then(async(products) => { 
                let userDetails = req.session.user
                let cartCount
                if(userDetails) cartCount= await cartServices.cartCountHelper(userDetails._id)
                res.render('user/shopping/category', {
                    products,men:true,category,userDetails,cartCount
                })

            })
            

            
        }

        
    },
    shopingCategoryWomen: async (req, res, next) => {
        let category = await Category.aggregate([{ $lookup:{from:"parentcategories",localField:"parentCategory",foreignField:"_id",as:"result"}},{$match:{"result.parentCategory":"Women",noSqlMode:{ $ne: "3" },status:true}},{$project:{subCategory:1}}])
    
        // console.log(req.params.id);
        if (req.params.id==='102women') {
            ShoppingServices.getAllProduct('Women').then(async(products) => {
                let userDetails = req.session.user
                let cartCount
                if(userDetails) cartCount= await cartServices.cartCountHelper(userDetails._id)
                res.render('user/shopping/category', {
                    products,category,userDetails,cartCount
                })
            })
        }
        else {
            ShoppingServices.getProductCategoryWise(req.params.id).then(async(products) => { 
                let userDetails = req.session.user
                let cartCount
                if(userDetails) cartCount= await cartServices.cartCountHelper(userDetails._id)
                res.render('user/shopping/category', {
                    category,products,userDetails,cartCount
                })

            })
            

            
        }   
    },
    productInDetail: async (req, res) => {
        try {
            if (req.params.id.length===24) {
                let prodId = req.params.id;
                let userDetails= req.session.user 
                let product = await Product.findById(prodId);
                let sizes = await ShoppingServices.findSizeAndQuantityForProduct(prodId)
                let cartCount
                if(userDetails) cartCount= await cartServices.cartCountHelper(userDetails._id)
                res.render('user/shopping/productInDetail', { product, sizes,userDetails,cartCount})
            } else {
                throw 'Parameter is not a number!'
            }
           
            // const url = await page.url();
            // console.log(url,"frsgvgvfdsfsdfggsdgv");
        } catch (error) {
            console.log(error)
            res.send(404)
        }
        
    },
    getProductQuantityWithSize: async(req, res) => {
        try {
            let productConstantId = req.params.id;
        

            
            let productQuantity = await  ShoppingServices.getProductQuantityWithSize(productConstantId)
           
            
            if (productQuantity) {
                if (req.session.user) {
                    let userId = req.session.user._id;
                    console.log(userId);
                    let productInCartExistOrNot = await Cart.findOne({ user_id: mongoose.Types.ObjectId(userId) }, {products: { $elemMatch: { productConstantId: mongoose.Types.ObjectId(productConstantId) } } })
                    // console.log(productInCartExistOrNot);

                    res.status(200).json({ productQuantity, productInCartExistOrNot })
                }
                else {
                

                    res.status(200).json({ productQuantity,productInCartExistOrNot:false })
                }

                
        }
        } catch (error) {
            console.log(error)
            res.send(404)
        }
        

        
    }
    
}