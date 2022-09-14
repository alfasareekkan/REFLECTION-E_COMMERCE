const Category = require("../models/category");
const ParentCategory=require("../models/parentCategory")
const Brand = require("../models/brand");
const cloudinary=require('../utils/cloudinary');


module.exports = {
  addCategory: (values,image) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let isCheck = await Category.findOne({ $and: [{ subCategory:values.subCategory},{parentCategory:values.parentCategory}] })
  
      if (isCheck) {
        resolve((response.status = true));
      } else {
        let result =await cloudinary.uploader.upload(image)

        let { subCategory, parentCategory } = values;
        let newCategory = new Category({
          subCategory,
          parentCategory,
          image_url: result.secure_url,
          cloudinary_id: result.public_id
        });
        newCategory.save().then(() => resolve((response.status = false)));
      }
    });
  },
  adminViewCategory: () => {
    return new Promise(async (resolve, reject) => {
      let response={}
      let parentCategories = await ParentCategory.find({ noSqlMode: { $ne: "3" } })
      let categories =
        await Category.aggregate([
          {
            $match: {
            noSqlMode:{$ne:"3"}
          }
        },
        {$lookup:{
          from: 'parentcategories',
          localField: 'parentCategory',
          foreignField: '_id',
          as:'result'
          
          }
          },
          {
            $project: {
              subCategory: 1,
              image_url: 1,
              cloudinary_id: 1,
              status: 1,
              noSqlMode: 1,
              result: 1,
              
              
        }}
        
      ])
      response={parentCategories,categories}
    
      resolve(response);
    });
  },
  deleteCategory: (id) => {
    return new Promise(async (resolve, reject) => {
      let data={noSqlMode:"3"}
      await Category.findByIdAndUpdate(id,data,{new:true});
      resolve();
    });
  },
    updateCategory: (id,cloud_id ,values,image) => {
    return new Promise(async (resolve, reject) => {
      let result={};
      if (image) {
        await cloudinary.uploader.destroy(cloud_id)
        result=await cloudinary.uploader.upload(image)
      }
      else {
      let categories=await Category.findOne({ _id: id });
      result.secure_url =categories.image_url,
      result.public_id= categories.cloudinary_id
      }
      let { subCategory, parentCategory } = values;
      await Category.updateOne(
        { _id: id },
        {
          $set: {
            subCategory,
            parentCategory,
            image_url: result.secure_url,
            cloudinary_id: result.public_id,
          noSqlMode:"2"

          },
        }
      );
      resolve();
    });
  },
  adminAddBrand: (brandDetails,brandLogo) => {
    return new Promise(async (resolve, reject) => { 
      try {
         const result = await cloudinary.uploader.upload(brandLogo)
         let brand = new Brand({
              brandName: brandDetails.brandName,
              brandLogo: result.secure_url,
             cloudinary_id:result.public_id
         })
         brand.save().then(() => { 
          resolve()
        })
        res.json(result)
    } catch (error) {
        
    }
    })
  },
  adminViewBrand: () => {
    return new Promise(async (resolve, reject) => {
      let brands = await Brand.find();
      // .exec()
      resolve(brands);
    });
    
  },
  adminDeleteBrand: (id) => {
    return new Promise(async (resolve, reject) => { 
      try {
        
        let brand =await Brand.findById(id);
        
        await cloudinary.uploader.destroy(brand.cloudinary_id)
        await brand.remove()
        resolve()
        
      } catch (error) {
      
      }
     
    })

  },
  adminUpdateBrand: (brandData, brandLogo, id) => {
    return new Promise(async (resolve, reject) => { 
      try {
        let brand = await Brand.findById(id);
      let result;
      if (brandLogo) {
        await cloudinary.uploader.destroy(brand.cloudinary_id)
        result= await cloudinary.uploader.upload(brandLogo)
      }
        const data = {
        brandName:brandData.brandName || brand.brandName,
        brandLogo:result?.secure_url||brandLogo.secure_url,
          cloudinary_id: result?.public_id || brand.cloudinary_id
        }
        brand = await Brand.findByIdAndUpdate(id, data, { new: true })
        resolve()
      
        
      } catch (error) {
        
      } 

    })
  },
  blockCategory: (id) => {
    return new Promise((resolve, reject) => {
      try {
        Category.findOneAndUpdate({ _id: id }, [{ $set: { status: { $eq: [false, "$status"] } } }]).then((data) => {
          resolve(data)
        })
      
      } catch (error) {
      reject()
      }
     })
  },
  adminAddParentCategory: async (Informations, image,id,cloudinary_id) => {
  
    return new Promise(async (resolve, reject) => {
      if (id) {
        try {
          await cloudinary.uploader.destroy(cloudinary_id)
        let result = await cloudinary.uploader.upload(image)
        let data = {
          parentCategory: Informations.parentCategory,
          image_url: result.secure_url,
          cloudinary_id: result.public_id,
           noSqlMode:"2"
          }
          await ParentCategory.findByIdAndUpdate(id, data, { new: true })
          resolve()
        } catch (error) {
          reject()
        }
        
        
      }
      else {
        try {
          let result = await cloudinary.uploader.upload(image)
          let parent_Category = new ParentCategory({
            parentCategory: Informations.parentCategory,
            image_url: result.secure_url,
            cloudinary_id: result.public_id,
            noSqlMode:"1",status:false
          })
          parent_Category.save().then(() => {
         resolve()
          })
       
        } catch (error) {
          reject()
        }  }
  
      })
    
    
  },
  adminviewParentCategory: () => {
    return new Promise(async (resolve, reject) => { 
      try {
        let result = await ParentCategory.find({noSqlMode:{$ne:"3"}})
        resolve(result)
      } catch (error) {
        reject()
      }
    })
  },
  adminManageParentCategory: (id) => {
    return new Promise(async (resolve, reject) => { 
      try {
        let data = {
          noSqlMode:"3"
        }
        await ParentCategory.findByIdAndUpdate(id, data, { new: true })
        resolve()
        
      } catch (error) {
        reject()
      }
    })
  }, blockParentCategory: (id) => { 
    return new Promise(async (resolve, reject) => {
      try {
        ParentCategory.findOneAndUpdate({ _id: id }, [{ $set: { status: { $eq: [false, "$status"] } } }]).then((data) => {
          resolve(data)
        })
      
      } catch (error) {
      reject()
      }
    })
},
};
