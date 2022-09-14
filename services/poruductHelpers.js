const Category=require('../models/category')
const cloudinary = require('../utils/cloudinary');
const Products = require('../models/product')
const Sizes = require('../models/prodectSize')
const mongoose = require('mongoose');

module.exports = {
    addminAddProductImagesIntoServer:(images)=>{
        return new Promise((resolve, reject) => {
            
            try {
                

                
                let arr = []
                 images.map(async (element) => {
                    
                    
                    let result = await cloudinary.uploader.upload(element.path)
                    console.log(result)
                    arr.push({
                        iamge_url: result.secure_url,
                        cloudinary_id:result.public_id
                    })
                     if (arr.length === 3) {
                        resolve(arr)
                    }
                
                 }) 
               
            } catch (error) {
                
            }
        })
    },
    addminAddProductIntoDB: (productData,imageArray) => {
        return new Promise(async (resolve, reject) => { 
            var categoryId = mongoose.Types.ObjectId(productData.categoryId)
            try {
                
                let product =new Products( {
                    title: productData.title,
                    category:categoryId,
                    brand: productData.brandId,
                    description: productData.description,
                    price: productData.price,
                    image: imageArray   
                })
                product.save().then((data) => {
                    resolve()
                })
                
            } catch (error) {
                
            }

        })
    },
    adminviewAllProducts: () => {
        return new Promise(async (resolve, reject) => { 
            Products.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                }, {
                    $lookup: {
                        from: 'brands',
                        localField: "brand",
                        foreignField: "_id",
                        as:"brand"
                   } 
                },
                {
                    $lookup:{
                        from: "parentcategories",
                        localField: "category.parentCategory",
                        foreignField: "_id",
                        as: "parent"
                      }

                },
                {
                    $project: {
                        
                        title: 1,
                        category: 1,
                        parent:1,
                        brand: 1,
                        price:1,
                        description: 1,
                        image:1,
                        active:1,
                        createdYear: { $year: "$createdAt" },
                        createdMonth: { $month: "$createdAt" },
                        createdDay: { $dayOfMonth: "$createdAt" },
                        updatedYear: { $year: "$updatedAt" },
                        updatedMonth: { $month: "$updatedAt" },
                        updatedDay: { $dayOfMonth: "$updatedAt" }
                 }
                }
            ]).then((data) => {
                console.log(data)
                resolve(data)
            })

        })
    },
    adminProductDelete: (id, image1_id, image2_id, image3_id) => {
        return new Promise(async(resolve, reject) => { 
            
             cloudinary.uploader.destroy(image2_id)
             cloudinary.uploader.destroy(image3_id)
            await Products.findByIdAndDelete(id).then(() => {
                resolve()
            })
        })

    },
    adminUpdateProductToserver: async(images,id) => {
        
            let product = await Products.findById(id)
            console.log(product.image)
            
            for (let i = 0; i < images.length; i++){
              
                if (images[i].fieldname === 'image1') {
                    
                    
                    let cal = await cloudinary.uploader.destroy(product.image[0].cloudinary_id)
                  
                    let result = await cloudinary.uploader.upload(images[i].path)
                    

                    await Products.findOneAndUpdate(
                        {
                            _id:id,
                            'image.cloudinary_id': product.image[0].cloudinary_id
                          },
                          {
                            $set: {
                                  'image.$.iamge_url':result.secure_url,
                                  'image.$.cloudinary_id': result.public_id
                            }
                          }
                     )
                        
                       
                }
                else if (images[i].fieldname === 'image2') {
                    
                    
                    let cal = await cloudinary.uploader.destroy(product.image[1].cloudinary_id)
                  
                    let result = await cloudinary.uploader.upload(images[i].path)
                    console.log(result);

                    await Products.findOneAndUpdate(
                        {
                            _id:id,
                            'image.cloudinary_id': product.image[1].cloudinary_id
                          },
                          {
                            $set: {
                                  'image.$.iamge_url':result.secure_url,
                                  'image.$.cloudinary_id': result.public_id
                            }
                          }
                     )
                        
                       
                }
                else {
                    let cal = await cloudinary.uploader.destroy(product.image[2].cloudinary_id)
                  
                    let result = await cloudinary.uploader.upload(images[i].path)
                    console.log(result);

                    await Products.findOneAndUpdate(
                        {
                            _id:id,
                            'image.cloudinary_id': product.image[2].cloudinary_id
                          },
                          {
                            $set: {
                                  'image.$.iamge_url':result.secure_url,
                                  'image.$.cloudinary_id': result.public_id
                            }
                          }
                     )
                }
                
            }

        
    },
    adminUpdateProductToDB: (productData, id) => {
        return new Promise(async(resolve, reject) => { 
            try {
                let category = await Category.findOne({ parentCategory: productData.parentCategory, subCategory: productData.subCategory },{_id:1})
                await Products.updateOne({ _id: id }, {
                    $set: {
                        title: productData.title,
                        category: category,
                        brand: productData.brand,
                        description: productData.description,
                        price: productData.price,
                        offerPrice: productData.offerPrice,
                        stock: productData.stock,
                        color: productData.color,
                      
                    }
                })
                resolve()
            } catch (error) {
                
            }
        })
    },
    adminAddProductSize: (information) => {
        return new Promise(async(resolve, reject) => {
            let { categoryId, size } = information
            let sizeCollection = new Sizes({
                categoryId,size
            })
            await sizeCollection.save()
            resolve()
     })
    }
    
}